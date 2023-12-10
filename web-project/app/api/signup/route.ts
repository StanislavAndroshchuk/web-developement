'use server'
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database:process.env.database,
  password: process.env.password,
  port: 5433
});

async function createUser(username: string, password: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Перевірка, чи існує вже користувач з таким іменем
    const { rows } = await client.query('SELECT id FROM users WHERE username = $1', [username]);
    if (rows.length > 0) {
      return { error: 'User is already exist' };
    }

    // Хешування паролю
    const hashedPassword = await bcrypt.hash(password, 10);

    // Вставка нового користувача
    await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    await client.query('COMMIT');
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
export  async function POST(req:Request){
  const { username, password } = await req.json()
    try {
      const result = await createUser(username, password);
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error}),{status:400}) 
      } else {
        return new Response(JSON.stringify({ message: 'User successfully created'}),{status:201}) 
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error creating a user'}),{status:400}) 
    }
}
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse 
// ) {
//   if (req.method === 'POST') {
//     const { username, password } = req.body;

//     try {
//       const result = await createUser(username, password);
//       if (result.error) {
//         res.status(400).json({ error: result.error });
//       } else {
//         res.status(201).json({ message: 'Користувач успішно створений' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Помилка при створенні користувача' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).json({ error: `Метод ${req.method} не дозволений` });
//   }
// }
