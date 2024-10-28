from flask import Flask, session, jsonify, request
from flask_session import Session
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json

# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)

# Configurar Flask-Session con la SECRET_KEY del archivo .env
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = 'filesystem'

# Habilitar CORS para permitir solicitudes desde el frontend
CORS(app, supports_credentials=True)

# Inicializar Flask-Session
Session(app)

# Simular un archivo JSON para almacenar usuarios
USERS_FILE = 'users.json'

# Funciones para manejar usuarios (cargar y guardar)
def load_users():
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

# Ruta para registrar un nuevo usuario (Sign Up)
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    users = load_users()

    if username in users:
        return jsonify({'message': 'Username already exists'}), 409

    # Registrar al nuevo usuario
    users[username] = password
    save_users(users)

    return jsonify({'message': 'User registered successfully'}), 201

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    users = load_users()

    # Verificar credenciales
    if username in users and users[username] == password:
        session['user'] = username  # Almacenar el usuario en la sesión
        return jsonify({'message': 'Login successful!'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Ruta para cerrar sesión
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)  # Eliminar la sesión del usuario
    return jsonify({'message': 'Logged out successfully!'}), 200

# Ruta protegida
@app.route('/protected', methods=['GET'])
def protected():
    if 'user' in session:
        return jsonify({'message': f'Welcome, {session["user"]}!'}), 200
    else:
        return jsonify({'message': 'Unauthorized'}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)
