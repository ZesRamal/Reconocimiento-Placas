import cv2
import requests

# Configura la cámara web
cap = cv2.VideoCapture(0)  # 0 es el ID de la cámara web, si tienes más de una puedes cambiarlo

# Asegúrate de que la cámara se haya inicializado correctamente
if not cap.isOpened():
    print("No se pudo abrir la cámara")
    exit()

# Reemplaza con tu token de API
api_token = '014aad6757469a81d894a79986a460eb876d5df9'

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

while True:
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

        # Imprimir el resultado de la API
        print(response.json())

    # Romper el bucle si se presiona la tecla 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cuando todo esté listo, libera la captura de video
cap.release()
cv2.destroyAllWindows()
