// Importar dependencias
import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';  // Agregado para manejar la subida de archivos
import { v2 as cloudinary } from 'cloudinary';  // Importar Cloudinary

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(fileUpload());  // Middleware para manejo de archivos

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const platesFilePath = path.join(__dirname, 'data', 'plates.json');
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Función para cargar usuarios desde el archivo JSON
const loadUsers = () => {
    try {
        const dataBuffer = fs.readFileSync(usersFilePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error) {
        return [];
    }
};

// Función para guardar usuarios en el archivo JSON
const saveUsers = (users) => {
    const dataJSON = JSON.stringify(users, null, 2);
    fs.writeFileSync(usersFilePath, dataJSON);
};

// Función para cargar placas desde el archivo JSON
const loadPlates = () => {
    try {
        const dataBuffer = fs.readFileSync(platesFilePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error) {
        return [];
    }
};

// Función para guardar placas en el archivo JSON
const savePlates = (plates) => {
    const dataJSON = JSON.stringify(plates, null, 2);
    fs.writeFileSync(platesFilePath, dataJSON);
};

// Ruta de registro
app.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    const users = loadUsers();
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { username, password: hashedPassword };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Ruta para analizar una imagen y registrar la placa
app.post('/api/recognize-plate', async (req, res) => {
    try {
        const image = req.files.image;  // Obtener la imagen del formulario
        const imagePath = path.join(__dirname, 'images', image.name);

        // Guardar la imagen en la carpeta 'images' temporalmente
        image.mv(imagePath, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar la imagen' });
            }

            try {
                // Crear form-data para enviar la imagen a la API de Plate Recognizer
                const formData = new FormData();
                formData.append('upload', fs.createReadStream(imagePath));

                // Enviar la imagen a Plate Recognizer
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

                const plateData = response.data.results[0];  // Obtener los datos de la placa detectada

                // Subir la imagen a Cloudinary
                const cloudinaryResult = await cloudinary.uploader.upload(imagePath, {
                    upload_preset: 'third-party',  // Asegúrate de configurar el preset de subida
                });

                // Eliminar la imagen local después de subirla a Cloudinary
                fs.unlinkSync(imagePath);

                // Crear un nuevo registro con la placa detectada, hora y URL de la imagen en Cloudinary
                const newPlateRecord = {
                    timestamp: new Date().toISOString(),
                    plate: plateData.plate,
                    imageUrl: cloudinaryResult.secure_url  // URL de Cloudinary
                };

                const plates = loadPlates();
                plates.push(newPlateRecord);
                savePlates(plates);

                res.json({ message: 'Placa detectada y almacenada', plate: newPlateRecord });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al reconocer la placa o subir la imagen a Cloudinary.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error general en el proceso.' });
    }
});

// Ruta para obtener todas las placas registradas
app.get('/api/plates', (req, res) => {
    const plates = loadPlates();
    res.json(plates);
});

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
