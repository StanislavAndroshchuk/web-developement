import React from 'react';
import MatrixInput from '@/components/MatrixInput';
import LoginPage from '@/components/LoginPage';
import SignupPage from '@/components/SignupPage';
import { Alert, TextField,Box,Typography } from '@mui/material';
import Button from '@/components/Button';
import Link from 'next/link'
export default function Home() {
  return (
    <section className="flexCenter flex-col mb-10">
       {/*Додайте компонент MatrixInput на сторінку*/}
       {/* <MatrixInput /> */}
       <Typography component="h1" variant="h5" className="flex justify-center font-bold">
          This website has been made for university task
        </Typography>
        <Box className="my-10 " >
            <div className='flex justify-center font-bold mb-3'>
            In this project i've realised:
            </div>
            <ul className='flex flex-col gap-2 '>
                <li >
                  1.Navigation Bar to be able easy switch between pages
                </li>
                <li >
                  2.Footer with all information about me
                </li>
                <li >
                  3.Authentication
                </li>
                <li>
                  4.Matrix Calucator that can mupltiply 2 different matrix 
                </li>
                <li>
                  5.History for users to manage tasks
                </li>
            </ul>
            <div className='flex justify-center font-bold mt-3 mb-3'>To start
            </div>
            <Box className="flex justify-center">
            <Link href='/matrix'>
            <Button
            type="button"
            title="    Start    "
            // icon="/user.svg"
            variant="btn_dark_green_outline"
            />
            </Link>
            </Box>
            </Box>
            
    </section>
  );
}
