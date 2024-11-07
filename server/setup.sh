#!/bin/bash

# Crear el entorno virtual si no existe
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activar el entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Mensaje de confirmación
echo "Entorno virtual configurado y dependencias instaladas."
