// Importar dependencias
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routers/routes.js';
import { v2 as cloudinary } from 'cloudinary';
import client from './models/faunaClient.js'; // Importar el cliente de FaunaDB

// Inicializar Express
const app = express();

// Puerto del servidor
const PORT = process.env.PORT || 1100;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar CORS
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Rutas del backend
app.use('/api', router);

// Ruta de prueba
app.get('/', (req, res) => res.send('Hello!'));

// Iniciar el servidor
app.listen(PORT, () => console.log(`Server running on ${PORT}!`));

export default client;
