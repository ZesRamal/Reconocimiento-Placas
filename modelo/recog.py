import cv2
import os
import requests
import firebase_admin
from firebase_admin import credentials, firestore
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from datetime import datetime  # Importa el módulo datetime

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Inicializa Firebase
cred = credentials.Certificate('/home/nosey/Descargas/placas-d75f3-firebase-adminsdk-yqph7-09a552f8e6.json')  # Reemplaza con la ruta a tu archivo de credenciales
firebase_admin.initialize_app(cred)
db = firestore.client()

# Configura Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

# Configura la cámara web
cap = cv2.VideoCapture(0)  # 0 es el ID de la cámara web, cambia si tienes más de una

# Asegúrate de que la cámara se haya inicializado correctamente
if not cap.isOpened():
    print("No se pudo abrir la cámara")
    exit()

# Obtener el token de la API desde el archivo .env
api_token = os.getenv('PLATE_RECOGNIZER_API_KEY')

def detectar_placa(frame):
    """
    Detecta si en el frame dado hay una forma rectangular que podría ser una placa.
    """
    # Convierte el frame a escala de grises
    gris = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Aplica un desenfoque para suavizar la imagen y reducir el ruido
    blur = cv2.GaussianBlur(gris, (5, 5), 0)

    # Usa el algoritmo de Canny para detectar bordes
    bordes = cv2.Canny(blur, 100, 200)

    # Encuentra los contornos en la imagen de bordes
    contornos, _ = cv2.findContours(bordes, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

    for contorno in contornos:
        # Obtiene un polígono aproximado para el contorno
        epsilon = 0.02 * cv2.arcLength(contorno, True)
        approx = cv2.approxPolyDP(contorno, epsilon, True)

        # Si el polígono tiene 4 vértices, podría ser un rectángulo
        if len(approx) == 4:
            # Calcula el área del posible rectángulo
            area = cv2.contourArea(approx)
            if area > 500:  # Filtra contornos muy pequeños
                # Obtén las coordenadas del rectángulo
                x, y, w, h = cv2.boundingRect(approx)
                
                # Proporción de aspecto típica de una placa (ancho es mayor que la altura)
                proporcion_aspecto = w / float(h)
                
                if 2 < proporcion_aspecto < 5:  # Ajusta según el formato típico de placas
                    # Dibuja el rectángulo en la imagen original
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
                    return True, frame  # Devuelve que se ha detectado una placa
    return False, frame

# Conjunto para almacenar placas detectadas
placas_detectadas = set()

# Contador de frames procesados
frames_procesados = 0
max_frames = 100  # Limitar a 100 frames para evitar bucle infinito

while frames_procesados < max_frames:
    # Captura frame por frame
    ret, frame = cap.read()

    # Si no se pudo leer el frame, salir del loop
    if not ret:
        print("No se pudo recibir el frame (la cámara puede estar desconectada)")
        break

    # Detecta la placa en el frame
    placa_detectada, frame_procesado = detectar_placa(frame)

    # Muestra el frame capturado (con o sin detección)
    cv2.imshow('Cámara', frame_procesado)

    # Si se detectó una placa, envía el frame a la API
    if placa_detectada:
        # Codifica el frame a formato JPG para enviar a la API
        success, image_jpg = cv2.imencode('.jpg', frame)
        if not success:
            print("No se pudo codificar la imagen")
            continue

        # Convertir la imagen codificada a un string de bytes
        files = {'upload': image_jpg.tobytes()}

        # Realizar la solicitud a la API
        response = requests.post(
            'https://api.platerecognizer.com/v1/plate-reader/',
            headers={'Authorization': f'Token {api_token}'},
            files=files
        )

        # Procesar la respuesta
        result = response.json()
        print(result)

        # Almacena los datos en Firestore solo si hay resultados
        if 'results' in result and len(result['results']) > 0:
            # Extrae la información de la placa
            plate_data = result['results'][0]
            plate_number = plate_data.get('plate', 'Desconocido')

            # Verifica si la placa ya ha sido detectada
            if plate_number not in placas_detectadas:
                # Agrega la placa al conjunto de placas detectadas
                placas_detectadas.add(plate_number)

                # Guardar la imagen en Cloudinary
                upload_response = cloudinary.uploader.upload(image_jpg.tobytes(), resource_type='image')
                image_url = upload_response['secure_url']  # URL segura de la imagen almacenada

                # Obtener el timestamp actual como cadena
                timestamp_string = datetime.now().isoformat()  # Formato ISO 8601

                # Almacena en Firestore
                db.collection('plates').add({
                    'timestamp': timestamp_string,  # Almacena el timestamp como string
                    'plate': plate_number,
                    'imageUrl': image_url
                })
                print(f"Datos de la placa almacenados: {plate_number}, URL de la imagen: {image_url}")
            else:
                print(f"La placa {plate_number} ya ha sido registrada.")

    # Aumentar el contador de frames procesados
    frames_procesados += 1

    # Romper el bucle si se presiona la tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cuando todo esté listo, libera la captura de video
cap.release()
cv2.destroyAllWindows()
