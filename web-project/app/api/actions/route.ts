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



export async function GET(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const task = requestHeaders.get('authorization')
    //console.log(requestHeaders.get('authorization'))
    const client = await pool.connect();  
    try{
        const result = await client.query(
            'SELECT result FROM matrix_operationsv2 WHERE id = $1',
            [task]);
        if (result.rows.length === 0) {
            throw new Error('Task not found');
            }
        const fileBuffer = result.rows[0].result;
        const headers = new Headers();
        headers.append('Content-Type', 'application/octet-stream');
        headers.append('Content-Disposition', `attachment; filename="file_${task}.bin"`);
        return new Response(fileBuffer, {
            status: 200,
            headers: headers
          });
    }
    catch (error) {
        return new Response(JSON.stringify({error: "No token"}),{status:401});
    }
    finally {
        client.release();
      }
    
   
  }
export async function DELETE(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const task = requestHeaders.get('authorization')
    const taskId = Number(task);
    if (!taskId) {
        return new Response("Task ID is required", { status: 400 });
    }
    // console.log(taskId)
    // console.log(typeof(taskId))

    const client = await pool.connect();
    try {
        await client.query('DELETE FROM matrix_operationsv2 WHERE id = $1', [taskId]);
        return new Response(null, { status: 204 }); // 204 No Content for successful deletion without response body
    } catch (error) {
        return new Response(error.message, { status: 500 });
    } finally {
        client.release();
    }
}
