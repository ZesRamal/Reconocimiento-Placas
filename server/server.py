from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import timedelta

# Cargar variables del archivo .env
load_dotenv()

app = Flask(__name__)

# Configurar JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)

# Habilitar CORS
CORS(app, supports_credentials=True)

# Inicializar JWTManager
jwt = JWTManager(app)

# Configurar Firebase
firebase_credentials_path=os.getenv("FIREBASE_CREDENTIALS_PATH")
cred = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Configurar Flask-Limiter para límites de tasa
limiter = Limiter(
    key_func=get_remote_address,  # Usa la dirección IP para limitar las peticiones
    app=app,
    default_limits=["10 per hour"]  # Límite global: 10 peticiones por hora
)


# Ruta para registrar un nuevo usuario
@app.route('/register', methods=['POST'])
@limiter.limit("5 per hour")  # Límite específico para el registro de 5 peticiones por hora
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    # Verificar si el usuario ya existe en Firebase
    user_ref = db.collection('users')
    query = user_ref.where('username', '==', username).get()
    if query:
        return jsonify({'message': 'Username already exists'}), 409

    # Registrar al nuevo usuario en Firebase
    new_user_ref = user_ref.document()
    new_user_ref.set({
        'username': username,
        'password': password
    })
    return jsonify({'message': 'User registered successfully'}), 201

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Consultar usuario en Firebase
    users_ref = db.collection('users')
    query = users_ref.where('username', '==', username).get()
    
    if query and query[0].to_dict()['password'] == password:
        # Crear tokens de acceso y refresh
        access_token = create_access_token(identity=username)
        refresh_token = create_refresh_token(identity=username)
        return jsonify(access_token=access_token, refresh_token=refresh_token), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Ruta para la renovación del token
@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@limiter.limit("5 per hour") 
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token), 200

# Ruta protegida
@app.route('/protected', methods=['GET'])
@jwt_required()
@limiter.limit("10 per hour")
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Welcome, {current_user}!'}), 200

# Manejo de tokens caducados
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'message': 'The token has expired'}), 401

# Manejo de usuarios bloqueados temporalmente
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        'message': 'Too many requests, please try again later.'
    }), 429

if __name__ == '__main__':
    app.run(debug=True, port=5000)
