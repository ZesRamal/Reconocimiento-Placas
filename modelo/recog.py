import cv2
import numpy as np
import pytesseract
from collections import Counter

# Configuración de Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Ruta del video
# ruta de donde se encuentra el video de muestra video_path = r''
cap = cv2.VideoCapture(video_path)

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
    # Usamos un contador para contar las coincidencias entre los caracteres de las placas
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
        if len(approx) == 4 and area > 3000:  # Mayor área mínima
            aspect_ratio = float(w) / h
            if 2.0 < aspect_ratio < 5.0:
                placa = frame[y:y + h, x:x + w]  # Extraer la placa del frame original

                # Mejorar calidad para OCR
                placa_gray = cv2.cvtColor(placa, cv2.COLOR_BGR2GRAY)
                placa_gray = cv2.GaussianBlur(placa_gray, (5, 5), 0)
                _, placa_bin = cv2.threshold(placa_gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

                # Extraer texto de la imagen de la placa binarizada
                text = pytesseract.image_to_string(placa_bin, config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                text = text.strip()

                # Validar texto
                if len(text) >= 6:  # Longitud típica de una placa
                    # Comparar con las placas ya detectadas
                    repetida = False
                    for placa_anterior in placas_detectadas:
                        if contar_caracteres_comunes(text, placa_anterior) >= 6:
                            repetida = True
                            break

                    if not repetida:  # Si no es repetida, la procesamos
                        print('PLACA: ', text)
                        placas_detectadas.append(text)  # Agregar a las placas detectadas

                        # Mostrar rectángulo y texto en el frame original
                        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
                        cv2.putText(frame, text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

                        # Mostrar solo la imagen de la placa en una ventana separada
                        cv2.imshow('PLACA', placa)  # Mostrar solo la placa detectada

    # Mostrar el frame procesado (completo) en la ventana 'Image'
    cv2.imshow('Image', frame)
    cv2.resizeWindow('Image', 800, 600)

    # Salir al presionar 'q'
    if cv2.waitKey(wait_time) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
