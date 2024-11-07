# Sistema de Control de Entrada y Salida de Autos por Número de Placa

Este sistema utiliza tecnología de reconocimiento óptico de caracteres (OCR) para identificar automáticamente las matrículas de los vehículos. Al instalar cámaras en los puntos de acceso, el sistema captura imágenes de las placas, obtiene los caracteres y los envía a una base de datos de donde se consultará la información desplegada en el dashboard web.

En este README encontrarás información general respecto al proyecto y cómo utilizarlo. Si gustas leer información más detallada al respecto puede dirigirte a nuestro google doc: [Documentación 📄](https://docs.google.com/document/d/1g2XP08FGQq8FJmYp_3psSb1SsMw6X24vORQCKUahHkM/edit?usp=sharing)

¿Qué tecnología usa?

Software:

- react: 18.3.1
- python: 3.12
- node: 20.11.1

Hardware:

- Jetson Nano

## ¿Cómo Instalar y Correr el Proyecto?

Necesitas tener instalado Node en su versión 18+ o 20+ en el siguiente enlace se tiene la documentación oficial al respecto: [React ⚛️](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs#how-to-install-nodejs)
Además de Python en su versión 3.12 (no se ha probado con otras). Te proporcionamos los enlaces de guía de instalación para cada plataforma:

- [Unix 🐧](https://docs.python.org/3/using/unix.html)
- [Windows 🪟](https://docs.python.org/3/using/windows.html)
- [MacOS 🍎](https://docs.python.org/3/using/mac.html)

Para clonar el proyecto abre una terminal en la ubicación deseada y escribe el comando (Debes de tener git instalado para realizar esta acción):

```bash
git clone https://github.com/ZesRamal/Reconocimiento-Placas.git
```

## ¿Cómo usar el proyecto?

Con el servidor express y el dashboard ejecutandose, iniciamos el programa de reconocimiento de placas. Se abrirá una ventana mostrando lo que se esta visualizando por la cámara. Al detectar un rectángulo con que cumpla con el requerimiento de lo que se considera una placa de un automóvil se tomará una cáptura, se procesarán los valores de la placa, se enviarán al servidor de donde se tomarán estos datos y se desplegarán en el dashboard.

## Estado y Roadmap

#### Estado:

Activo y en desarrollo.

#### Roadmap:

- Implementar el código en el módulo de desarrollo Jetson Nano.
- Implementar control de tráfico para dashboard.
- Implementar visualización gráfica de registro de entradas y salidas.

## Pantallas de la Aplicación

- _TBA._ N/A.

<img src="READMEAppScreenshots/TBA.jpg" width="300" height="700" alt="TBA.">

## Créditos

- Computer Vision Dev: [Oscar Anguiano Gonzalez](https://github.com/Oscar060502)
- Frontend Dev: [Cesar Francisco Ramos Leal](https://github.com/ZesRamal)
- Backend Dev: [Jared Zaragoza Rosales](https://github.com/K0i0s)

## Licencias

[Licencia MIT](LICENSE)
