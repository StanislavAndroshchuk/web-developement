'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { TextField, Alert, Box, Typography } from '@mui/material';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
export default function MatrixInput() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
        router.push('/login');
        return;
    }

    try {
        const decodedToken: any = jwt.decode(token);
        const currentTime = Date.now().valueOf() / 1000; // Convert to seconds

        if (!decodedToken.exp || decodedToken.exp < currentTime) {
            // Токен просрочений
            localStorage.removeItem('token');
            router.push('/login');
        }
    } catch (error) {
        console.error("Error decoding token:", error);
        router.push('/login');
    }
}, []);

  const [n, setN] = useState('');
  const [m, setM] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [percentage, setPercentage] = useState(0);
  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
    
  //   if (percentage < 100) {
  //     interval = setInterval(async () => {
  //       try {
  //         // Replace the URL with the actual URL you're going to get the percentage from
  //         const response = await fetch('/api/matrix/',{method:'GET'});
          
  //         if (response.ok) {
  //           const data = await response.json();
  //           setPercentage(data.percentage);
  //         }
  //       } catch (error) {
  //         console.error('Error getting progress:', error);
  //       }
  //     }, 150);
  //   } else {
  //     clearInterval(interval);
  //   }

  //   // Cleanup on unmount or if percentage reaches 100%
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [percentage]);

  const handleFileChange = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= 5242880) {
        // 5MB
        setFile(file);
      } else {
        setError('Файл повинен бути менше 5 МБ');
      }
    }
  };
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = (event.target?.result || "") as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Перевірка чи n та m є числами
    if (n === '' || m === '') {
      setError('Fields are not filled');
      return;
    }
    if (!n.match(/^\d+$/) || !m.match(/^\d+$/)) {
      setError('Некоректні значення');
      return;
    }
  
    // Перевірка чи файли не пусті
    if (!file1 || !file2) {
      setError('Матриці пусті');
      return;
    }
  
    // Create FormData object
    const formData = new FormData();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Токен не знайдений');
      return;
    }

    const decodedToken = jwt.decode(token);
    if (!decodedToken || typeof decodedToken !== 'object' || !decodedToken.userId) {
      setError('Помилка при декодуванні токена');
      return;
    }

    // formData.append('userId', decodedToken.userId);
    // formData.append('n', n);
    // formData.append('m', m);
    // formData.append('file1', file1);
    // formData.append('file2', file2);
  
    const file1Base64 = await fileToBase64(file1);
    const file2Base64 = await fileToBase64(file2);

    try {
      const response = await fetch('/api/matrix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: decodedToken.userId,
          n: n,
          m: m,
          file1: file1Base64,  
          file2: file2Base64
        })
      });

      const data = await response.json();
      //console.log(data)
      if (response.ok) {
        // // console.log('Data saved successfully with id', data.matrixId);
        // console.log('Data saved successfully with id', data.matrixId);

        // // Тут починаємо інтервал для перевірки прогресу
        // const intervalId = setInterval(async () => {
        //   try {
        //     const progressResponse = await fetch(`/api/progress/${data.matrixId}`, { method: 'GET'});

        //     if (progressResponse.ok) {
        //       const progressData = await progressResponse.json();
        //       setPercentage(progressData.percentage);

        //       if (progressData.percentage >= 100) {
        //         clearInterval(intervalId); // Зупинити інтервал, якщо завдання завершено
        //       }
        //     } else {
        //       const progressErrorData = await progressResponse.json();
        //       console.error('Error fetching progress:', progressErrorData.error);
        //     }
        //   } catch (error) {
        //     console.error('Error fetching progress:', error);
        //   }
        // }, 1500);
        router.push('/history');
        
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error saving matrix data:', error);
      setError('Error saving matrix data.');
    }
  };

  return (
    <Box className="flexCenter flex-col mb-10">
      <Typography component="h1" variant="h5" className="flex justify-center font-bold">
        Matrix Info
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Box className="flex justify-center gap-x-10 mt-5">
          <TextField
            label="n"
            type="text"
            inputProps={{ maxLength: 4 }}
            value={n}
            onChange={(e) => setN(e.target.value)}
          />
          <TextField
            label="m"
            type="text"
            inputProps={{ maxLength: 4 }}
            value={m}
            onChange={(e) => setM(e.target.value)}
          />
        </Box>
        <Box className="flex justify-center gap-10 font-bold">
          <label>Matrix A</label>
          <input type="file" accept=".bin" onChange={handleFileChange(setFile1)} />
        </Box>
        <Box className="flex justify-center gap-10 items-center font-bold">
          <label>Matrix B</label>
          <input type="file" accept=".bin" onChange={handleFileChange(setFile2)} />
        </Box>
        {error && (
          <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button type="submit" title="Execute" variant="btn_dark_green_outline" />
        {percentage > 0 && percentage <= 100 && (
        <Typography className="flex justify-center mt-3">
          Виконано: {percentage}%
        </Typography>
      )}
      </form>
    </Box>
  );
}
