// Importar dependencias
import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import FormData from 'form-data';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';  // Agregado para manejar la subida de archivos
import { v2 as cloudinary } from 'cloudinary';  // Importar Cloudinary
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Importar Firestore

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(fileUpload());  // Middleware para manejo de archivos

// Configurar CORS
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
  };

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración Firebase
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,  
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Ruta de registro
app.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    // Comprobar si el usuario ya existe
    const usersCollection = collection(db, 'users');
    const userExistsSnapshot = await getDocs(usersCollection);
    const userExists = userExistsSnapshot.docs.find(doc => doc.data().username === username);
    
    if (userExists) {
        return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { username, password: hashedPassword };
    
    // Guardar el nuevo usuario en Firestore
    await addDoc(usersCollection, newUser);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    
    const user = userSnapshot.docs.find(doc => doc.data().username === username);
    if (!user) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.data().password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ username: user.data().username }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

                // Guardar el registro en Firestore
                await addDoc(collection(db, 'plates'), newPlateRecord);

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
app.get('/api/plates', async (req, res) => {
    const platesCollection = collection(db, 'plates');
    const platesSnapshot = await getDocs(platesCollection);
    
    const plates = platesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(plates);
});

const PORT = process.env.PORT || 3000;


app.use(cors(corsOptions));

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
