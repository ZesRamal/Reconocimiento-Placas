// models/faunaClient.js
import { Client } from 'fauna';
import dotenv from 'dotenv';

dotenv.config();

// Configuramos el cliente de FaunaDB usando FQL v10
const client = new Client({
  secret: process.env.SECRET_FAUNA,
  domain: 'db.fauna.com',
  scheme: 'https',
});

export default client;