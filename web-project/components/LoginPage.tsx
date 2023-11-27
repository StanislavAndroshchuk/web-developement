'use client'
// components/LoginPage.tsx
import {useRouter} from 'next/navigation'
import React, { useState } from 'react';
import Link from 'next/link';
import Button from './Button';
import { Alert, TextField,Box,Typography } from '@mui/material';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username == '' || password == '' )
    {
      setError('Поля не заповнені.')
      return;
    }
    // Обробка логіна (можна використовувати API запит тут)
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
          className="input "
        />
        <input
          type="password"
          placeholder="Password"
          maxLength={25}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        {error && (
        <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
          {error}
        </Alert>
        )}
        <Button type="submit" title="Login" variant="btn_dark_green_outline" />
        <p className="text-center">
          Немає акаунту? <Link className="regular-16 text-gray-50  cursor-pointer pb-1.5 transition-all hover:font-bold" href="/register">Реєстрація</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
