import { fql } from 'fauna'
import client from '../server.js';

// Función para agregar un usuario
export const addUser = async (username, password) => {
  const query = fql`
    users.create({
      username: ${username},
      password: ${password}
    })
  `;
  return await client.query(query);
};

// Función para obtener un usuario
export const getUserByUsername = async (username) => {
  const query = fql`
    users.all() {
      username,
      password
    }
  `;
  const result = await client.query(query);
  const users = result.data.data;
  return users.find(u => u.username === username);
};
