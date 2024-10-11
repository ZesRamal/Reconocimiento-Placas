// Importar dependencias
import 'dotenv/config';
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import FormData from 'form-data';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';

// Configurar CORS
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};
  
  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json())
app.use(cors(corsOptions));

const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Función para cargar usuarios desde el archivo JSON
const loadUsers=()=>{
    try{
        const dataBuffer = fs.readFileSync(usersFilePath)
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)   
    } catch(error){
        return [];
    }
}

// Función para guardar usuarios en el archivo JSON
const saveUsers = (users) => {
    const dataJSON = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, dataJSON);
};

// Ruta de registro
app.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Verificar si las contraseñas coinciden
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Cargar usuarios existentes
    const users = loadUsers();

    // Verificar si el usuario ya existe
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    // Guardar el nuevo usuario en el archivo JSON
    saveUsers(users);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Cargar usuarios existentes
    const users = loadUsers();

    // Buscar al usuario
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Crear y enviar el token (opcional)
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Endpoint para analizar una imagen específica desde la carpeta 'images'
app.get('/api/recognize-plate/:imageName', async (req, res) => {
    try {
        // Nombre de la imagen desde la URL
        const imageName = req.params.imageName;
        // Ruta completa a la imagen en la carpeta 'images'
        const imagePath = path.join(__dirname, 'images', imageName);

        // Log para verificar la ruta completa del archivo
        console.log(`Analizando la imagen: ${imagePath}`);

        // Verificar si el archivo existe
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }

        // Crear form-data para enviar la imagen a la API de Plate Recognizer
        const formData = new FormData();
        formData.append('upload', fs.createReadStream(imagePath));

        // Enviar la imagen a la API
        const response = await axios.post(
            'https://api.platerecognizer.com/v1/plate-reader/',
            formData,
            {
                headers: {
                    'Authorization': `Token ${process.env.PLATE_RECOGNIZER_API_KEY}`,
                    ...formData.getHeaders()
                }
            }
        );

        // Responder con los resultados de la API
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al reconocer la placa.' });
    }
});

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});