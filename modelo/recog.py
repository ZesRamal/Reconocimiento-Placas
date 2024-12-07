import cv2
import os
import pytesseract
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de Tesseract en Linux
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'  # Ruta predeterminada en Linux

# Configurar Firebase Admin SDK
cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

cred = credentials.Certificate(cred_path)  # Ruta cargada desde el .env
firebase_admin.initialize_app(cred)
db = firestore.client()

# Ruta del video
video_path = '/home/nosey/Descargas/1.mp4'
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Error: No se pudo abrir el archivo de video. Verifica la ruta.")
    exit()

# Obtener el frame rate del video
fps = cap.get(cv2.CAP_PROP_FPS)
wait_time = int(1000 / fps)

# Crear ventanas ajustables
cv2.namedWindow('Bordes', cv2.WINDOW_NORMAL)
cv2.namedWindow('Image', cv2.WINDOW_NORMAL)
cv2.namedWindow('PLACA', cv2.WINDOW_NORMAL)

# Lista para almacenar placas detectadas
placas_detectadas = []

# Función para contar cuántos caracteres coinciden entre dos placas
def contar_caracteres_comunes(placa1, placa2):
    comunes = sum(1 for c1, c2 in zip(placa1, placa2) if c1 == c2)
    return comunes

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Fin del video o error al leer el archivo.")
        break

    # Preprocesamiento
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)
    canny = cv2.Canny(gray, 100, 200)
    canny = cv2.dilate(canny, None, iterations=1)

    # Mostrar bordes
    cv2.imshow('Bordes', canny)

    # Encontrar contornos
    cnts, _ = cv2.findContours(canny, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    for c in cnts:
        area = cv2.contourArea(c)
        x, y, w, h = cv2.boundingRect(c)
        epsilon = 0.02 * cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, epsilon, True)

        # Filtrar contornos
        if len(approx) == 4 and area > 3000:
            aspect_ratio = float(w) / h
            if 2.0 < aspect_ratio < 5.0:
                placa = frame[y:y + h, x:x + w]

                # Mejorar calidad para OCR
                placa_gray = cv2.cvtColor(placa, cv2.COLOR_BGR2GRAY)
                placa_gray = cv2.GaussianBlur(placa_gray, (5, 5), 0)
                _, placa_bin = cv2.threshold(placa_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

                # Extraer texto de la imagen de la placa binarizada
                text = pytesseract.image_to_string(placa_bin, config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                text = text.strip()

                if len(text) >= 6:
                    repetida = False
                    for placa_anterior in placas_detectadas:
                        if contar_caracteres_comunes(text, placa_anterior) >= 6:
                            repetida = True
                            break

                    if not repetida:
                        print('PLACA: ', text)
                        placas_detectadas.append(text)

                        # Guardar imagen localmente
                        img_name = f"placa_{text}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                        img_path = os.path.join("placas_detectadas", img_name)
                        os.makedirs("placas_detectadas", exist_ok=True)
                        cv2.imwrite(img_path, placa)

                        # Guardar información en Firestore (solo ruta local de la imagen)
                        doc_ref = db.collection('placas').document()
                        doc_ref.set({
                            "id_imagen": doc_ref.id,
                            "placa": text,
                            "fecha_hora_deteccion": datetime.now().isoformat(),
                            "imagen": img_path  # Guardar la ruta local
                        })

                        # Mostrar solo la imagen de la placa en una ventana separada
                        cv2.imshow('PLACA', placa)

    cv2.imshow('Image', frame)
    cv2.resizeWindow('Image', 800, 600)

    if cv2.waitKey(wait_time) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
