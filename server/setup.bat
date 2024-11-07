@echo off

REM Crear el entorno virtual si no existe
if not exist "venv" (
    python -m venv venv
)

REM Activar el entorno virtual
call venv\Scripts\activate

REM Instalar dependencias
pip install -r requirements.txt

REM Mensaje de confirmación
echo Entorno virtual configurado y dependencias instaladas.
