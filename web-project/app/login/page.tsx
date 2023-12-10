'use client'
// components/LoginPage.tsx
import {useRouter} from 'next/navigation'
import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import { Alert, TextField,Box,Typography } from '@mui/material';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (username === '' || password === '') {
      setError('Fields are not filled');
      return;
    }
  
    // Обробка логіна (API запит на сервер)
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
  
    if (response.ok) {
      // Зберігання JWT токену (можна використовувати localStorage, cookies або інші способи)
      localStorage.setItem('token', data.token);
      // Перенаправлення користувача на головну сторінку або іншу сторінку за вашим бажанням
      router.push('/');
    } else {
      // Вивід повідомлення про помилку
      setError(data.error || 'Login error');
    }
  };
  

  return (
    <div className="flexCenter flex-col mb-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Typography component="h1" variant="h5" className="flex justify-center font-bold ">
        Login
      </Typography>
        <input
          type="text"
          placeholder="Username"
          maxLength={25}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input h-10 flex justify-center px-3"
        />
        <input
          type={showPassword?'text':'password'}
          placeholder="Password"
          maxLength={25}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input h-10 flex justify-center px-3"
        />
        <label
          onClick={()=>setShowPassword(!showPassword)}
          className="bg-gray-300 hover:bg-gray-400 rounded px-3 py-1 text-sm text-gray-600 font-mono cursor-pointer flex justify-center font-bold " htmlFor="toggle">{showPassword?'Hide password':'Show password'}
          </label>
        
        {error && (
        <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
          {error}
        </Alert>
        )}
        <Button type="submit" title="Login" variant="btn_dark_green_outline" />
        <p className="text-center">
        Don't have an account? <Link className="regular-16 text-gray-50  cursor-pointer pb-1.5 transition-all hover:font-bold" href="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
