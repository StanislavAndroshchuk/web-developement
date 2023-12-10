'use server';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';

const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: 5433,
});
const servers = ['http://127.0.0.1:8001', 'http://127.0.0.1:8002'];
let lastUsed = 0;

function getNextServer() {
  const server = servers[lastUsed];
  lastUsed = (lastUsed + 1) % servers.length;
  return server;
}


async function storeMatrixData(userId: number, n: number, m: number, file1: File, file2: File) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'INSERT INTO matrix_operationsv2(user_id, n, m, matrix1, matrix2,result,progress) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [userId, n, m, file1, file2,null,0]
    );

    return result.rows[0].id; // Return the newly created matrix data's ID

  } catch (error) {
    console.log(error)
    throw error;
  } finally {
    client.release();
  }
}
async function getProgressForMatrixId(matrixId : number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM matrix_operationsv2 WHERE id = $1;',
      [matrixId]
    );

    // const matrix_id = result.rows[0].id; // Return the newly created matrix data's ID
    // console.log(matrix_id)
    console.log(result.rows[0].progress)
    return result.rows[0].progress;

  } catch (error) {
    console.log(error)
    throw error;
  } finally {
    client.release();
  }
}
export async function GET(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const token = requestHeaders.get('authorization')
    // const { searchParams } = new URL(req.url)
    // const id = searchParams.get('query')
    try {
    //    const matrixId = params.id
    //    // Or get the matrixId some other way
  
    //    const progress = await getProgressForMatrixId(Number(matrixId)); 
    //    //const progress = 40;
  
    //   return new Response(JSON.stringify({percentage:progress}),{status:200});
        if(!token){
            return new Response(JSON.stringify({error: "No token"}),{status:401});
        }
        // Декодування токену
        // const decoded = jwt.verify(token, process.env.JWT);
        // console.log(decoded)
        const decoded = jwt.decode(token);
        console.log(decoded)
        if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
            return new Response(JSON.stringify({error: "Invalid token"}),{status:401});
        }
        console.log(decoded.userId)
        // Отримання історії користувача
        // const tasks = await getUserHistory(decoded.userId);
        return new Response(JSON.stringify({er:'as'}),{status:200});
      
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error fetching progress'}),{status:400});
      
    }
  }