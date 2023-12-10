'use client'
import React, { useState, ChangeEvent } from 'react';
import Dropzone from './Dropzone';
import { Alert, TextField,Box,Typography } from '@mui/material';
export default function MatrixInput() {
  const [n, setN] = useState('');
  const [m, setM] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  const handleFile1Change = (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    setFile1(file);
  }
};

const handleFile2Change = (event: ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    const file = event.target.files[0];
    setFile2(file);
  }
};



  const handleSubmit = () => {
    // Відправити дані (n, m, file1, file2) на бекенд тут
  };

  return (
    <div className="flexCenter flex-col mb-10">
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <Typography component="h1" variant="h5" className="flex justify-center font-bold ">
        Matrix Info
      </Typography>
      <div className='flex justify-center'>
        <label className="mx-2">     
        n :       
        <input className="ml-3 border-2 border-red-500 w-20" 
        type="text" 
        value={n} 
        maxLength={7}
        onChange={(e) => setN(e.target.value)} />  
        </label>
        <label className="mx-2">    
          m : 
        <input className="ml-3 border-2 border-red-500 w-20"
          type="text"
          value={m}   
          maxLength={7}
          onChange={(e) => setM(e.target.value)} />
        </label>
      </div>
      <div>
        
      </div>
    </form>
    </div>








//     <div className="padding-container max-container flex w-full flex-col gap-5 mb-10">
  
//   <div className="flex justify-center">
//     <label className="mx-2">
//       n : 
//       <input className="ml-3 border-2 border-red-500 w-20" type="text" value={n} onChange={(e) => setN(e.target.value)} />
//     </label>
//     <label className="mx-2">
//       m : 
//       <input className="ml-3 border-2 border-red-500 w-20" type="text" value={m} onChange={(e) => setM(e.target.value)} />
//     </label>
//   </div>

//   <div className="flex justify-center">
//     <label>
//       Завантажити файл 1:
//       <input  className="ml-3 border-2 border-red-500 w-40"type="file" accept=".txt" onChange={handleFile1Change} />
//     </label>
//   </div>
  
//   <div>
//       {/* <h1>Завантажити файл TXT</h1>
//       <Dropzone onFileDrop={handleFileDrop} /> */}
//     </div>
//   {/* {<div className="flex justify-center">
//     <section className='py-10'>
//       <div className='container'>
//         <h2 className='text-3x1 font-bold'>
//           Matrix A
//         </h2>
//         <Dropzone className="mt-10 border border-neutral-200 p-16"></Dropzone>
//       </div>
//     </section>
//   </div>} */}
  
//   <div className="flex justify-center">
//     <button onClick={handleSubmit}>Відправити</button>
//   </div>
// </div>

  );
}
