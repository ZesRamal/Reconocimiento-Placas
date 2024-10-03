import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { addUser, getUserByUsername } from './userServices.js';
import { addCriminal, getCriminals , deleteCriminal } from './criminalServices.js';
import { v2 as cloudinary } from 'cloudinary'; // Asegúrate de importar cloudinary.v2
import jwt from 'jsonwebtoken';

const router = express.Router();

// Obtener el nombre del archivo y el directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../images');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir); // Crea la carpeta si no existe
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renombra el archivo
  }
});

const upload = multer({ storage });

// Ruta para subir imágenes
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Subir a Cloudinary usando el upload preset
    const result = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: 'third-party',
    });

    // Eliminar el archivo temporal después de la carga
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url, // URL de la imagen en Cloudinary
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error uploading image' });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    await addUser(username, password);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering user' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generar token JWT
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error logging in' });
  }
});

// Ruta para registrar un delincuente
router.post('/register-criminal', upload.single('image'), async (req, res) => {
  const { name, crime } = req.body;
  const imageUrl = req.file?.path; // Verifica que req.file existe

  if (!name || !crime || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Subir imagen a Cloudinary
    const result = await cloudinary.uploader.upload(imageUrl, {
      upload_preset: 'third-party', // Usa el preset adecuado
    });

    // Usar el servicio para agregar el delincuente
    const response = await addCriminal(name, crime, result.secure_url);

    // Eliminar el archivo temporal
    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      message: 'Criminal registered successfully',
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error registering criminal' });
  }
});

// Ruta para obtener todos los criminales
router.get('/criminals', async (req, res) => {
  try {
    const criminals = await getCriminals();
    return res.status(200).json({
      message: 'Criminals retrieved successfully',
      criminals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error retrieving criminals' });
  }
});

router.delete('/criminals/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Criminal ID is required' });
  }

  try {
    await deleteCriminal(id);
    return res.status(204).json({ message: 'Criminal deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting criminal' });
  }
});

export default router;