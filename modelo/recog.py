import cv2
import numpy as np
import pytesseract

# Configuración de Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Preprocesar la imagen
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)  # Prueba con diferentes tamaños de desenfoque
    canny = cv2.Canny(gray, 100, 200)  # Ajusta estos valores
    canny = cv2.dilate(canny, None, iterations=1)

    # Mostrar la imagen de bordes
    cv2.imshow('Bordes', canny)

    # Encontrar contornos
    cnts, _ = cv2.findContours(canny, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

    for c in cnts:
        area = cv2.contourArea(c)
        x, y, w, h = cv2.boundingRect(c)
        epsilon = 0.02 * cv2.arcLength(c, True)  # Ajusta este valor
        approx = cv2.approxPolyDP(c, epsilon, True)

        # Filtrar contornos
        if len(approx) == 4 and area > 2000:  # Ajusta el área según sea necesario
            aspect_ratio = float(w) / h
            if 2.0 < aspect_ratio < 5.0:  # Rango ajustado
                placa = gray[y:y + h, x:x + w]

                # Extraer texto de la placa
                text = pytesseract.image_to_string(placa, config='--psm 8 -c tessedit_char_whitelist=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ')
                print('PLACA: ', text.strip())

                # Mostrar resultados
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
                cv2.putText(frame, text.strip(), (x - 20, y - 10), 1, 2.2, (0, 255, 0), 3)

                # Mostrar la placa detectada
                cv2.imshow('PLACA', placa)
                cv2.moveWindow('PLACA', 780, 10)

    cv2.imshow('Image', frame)
    cv2.moveWindow('Image', 45, 10)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
