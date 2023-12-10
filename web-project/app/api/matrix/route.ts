'use server';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

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


async function storeMatrixData(userId: number, n: number, m: number, file1: File, file2: File, startTime: number) {
  const client = await pool.connect();
  try {
    //console.log('before insert');
    const result = await client.query(
      'INSERT INTO matrix_operationsv2(user_id, n, m, matrix1, matrix2,result,progress,start_time) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [userId, n, m, file1, file2,null,0,startTime]
    );
    //console.log('after insert');

    return result.rows[0].id; // Return the newly created matrix data's ID

  } catch (error) {
    console.log(error)
    throw error;
  } finally {
    client.release();
  }
}
async function countUserTasks(userId: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT COUNT(*) FROM matrix_operationsv2 WHERE user_id = $1;', // Вибрати лише незавершені завдання
      [userId]
    );

    return parseInt(result.rows[0].count, 10);

  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
}
async function getProgressForMatrixId(userId : number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM matrix_operationsv2 WHERE user_id = $1 ORDER BY id DESC LIMIT 1;',
      [userId]
    );

    const matrix_id = result.rows[0].id; // Return the newly created matrix data's ID
    console.log(matrix_id)
    console.log(result.rows[0].progress)
    return result.rows[0].progress;

  } catch (error) {
    console.log(error)
    throw error;
  } finally {
    client.release();
  }
}
export async function POST(req: Request) {
  //console.log('check');
  const { userId, n, m, file1, file2} = await req.json();

  try {
    const taskCount = await countUserTasks(userId);
    if (taskCount >= 10) {
      return new Response(JSON.stringify({ error: 'You have reached the limit of concurrent tasks' }), { status: 400 });
    }
    //console.log('before db')
    const matrixId = await storeMatrixData(userId, n, m, file1, file2, Date.now());
    console.log('before flask')
    const response = await fetch('http://127.0.0.1:8080/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({matrixId}),
    });
    const result = await response.json()
    console.log(result);
    // console.log(textResponse);
    // const parsedResponse = JSON.parse(textResponse);
    // console.log(parsedResponse);
    return new Response(JSON.stringify({ matrixId }), { status: 200 });
  } catch (error) {
    //console.log(error)
    return new Response(JSON.stringify({ error: 'Error saving matrix data' }), { status: 400 });
  }
}
export async function GET(req: Request) {
  try {
    const {userId} = await req.json(); // Or get the matrixId some other way

    const progress = await getProgressForMatrixId(userId); // You'd need to implement this function

    return new Response(JSON.stringify({percentage:progress}),{status:200});
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching progress'}),{status:400});
    
  }
}
