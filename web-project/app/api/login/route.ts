'use server'
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database:process.env.database,
    password: process.env.password,
    port: 5433
});

const JWT_SECRET = 'YOUR_JWT_SECRET'; // TODO: Встановіть власний секретний ключ

async function verifyUser(username: string, password: string) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT id, password FROM users WHERE username = $1', [username]);

    if (rows.length === 0) {
        console.log({error:'no user'});
        return { error: 'User not found' };
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        console.log({error:'bad pass'});
        return { error: 'Wrong password' };
    }

    const token = jwt.sign({ userId: user.id, username: username }, JWT_SECRET, { expiresIn: '1h' });

    return { token: token };

  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}
export async function POST(req:Request){
    const { username, password } = await req.json()

    try {
      const result = await verifyUser(username, password);
      if (result.error) {
        return new Response(JSON.stringify({error: result.error }), {status:401})
      } else {
        return new Response(JSON.stringify({token: result.token}), {status:200})
      }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Login error'}), {status:400})
    }
}
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === 'POST') {
//     const { username, password } = req.body;

//     try {
//       const result = await verifyUser(username, password);
//       if (result.error) {
//         res.status(401).json({ error: result.error });
//       } else {
//         res.status(200).json({ token: result.token });
//       }
//     } catch (error) {
//       res.status(400).json({ error: 'Помилка при вході' });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).json({ error: `Метод ${req.method} не дозволений` });
//   }
// }
