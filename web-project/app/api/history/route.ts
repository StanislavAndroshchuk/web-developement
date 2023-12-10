'use server'
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { headers } from 'next/headers'
import { type NextRequest } from 'next/server'
const pool = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: 5433,
  });

// Функція для отримання історії користувача
async function getUserHistory(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT id, progress, start_time FROM matrix_operationsv2 WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
}
export async function GET(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const token = requestHeaders.get('authorization')
    //console.log(requestHeaders.get('authorization'))
    try{
        if(!token){
            return new Response(JSON.stringify({error: "No token"}),{status:401});
        }
         // Декодування токену
        // const decoded = jwt.verify(token, process.env.JWT);
        // console.log(decoded)
        const decoded = jwt.decode(token);
        
        if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
            return new Response(JSON.stringify({error: "Invalid token"}),{status:401});
        }
        
        // Отримання історії користувача
        const tasks = await getUserHistory(decoded.userId);
        return new Response(JSON.stringify({tasks}),{status:200});
    }
    catch (error) {
        return new Response(JSON.stringify({error: "No token"}),{status:401});
    }
    
    return new Response(JSON.stringify({body: requestHeaders}),{status:200});
    // try {
    //     if (!token) {
    //         return res.status(401).json({ error: 'No token provided' });
    //       }
    //   const {userId} = await req.json(); // Or get the matrixId some other way
  
    //   const progress = await getProgressForMatrixId(userId); // You'd need to implement this function
  
    //   return new Response(JSON.stringify({percentage:progress}),{status:200});
      
    // } catch (error) {
    //   return new Response(JSON.stringify({ error: 'Error fetching progress'}),{status:400});
      
    // }
  }

