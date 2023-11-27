// components/SignupPage.tsx
'use client'
import React, { useState } from 'react';
import {useRouter} from 'next/navigation'
import Link from 'next/link';
import Button from './Button';
import { Alert, TextField,Box,Typography } from '@mui/material';
const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }
    if (username == '' || password == '' || confirmPassword =='' )
    {
      setError('Поля не заповнені.')
      return;
    }
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok && response.status === 201) {
      // Успішна реєстрація
      setSuccessMessage(data.message || 'Реєстрація успішна!');
      // Тут ви також можете очистити поля форми, якщо це потрібно
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      // router.push('/login'); // розкоментуйте для перенаправлення
    } else {
      // Встановіть помилку, отриману з API
      setError(data.error || 'Помилка при реєстрації');
    }

    // Тут можна додати логіку відправки даних на сервер

    // Перенаправлення на сторінку логіну або домашню сторінку після успішної реєстрації
    // router.push('/login');
  };

  return (
    <div className="flexCenter flex-col  mb-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Typography component="h1" variant="h5" className="flex justify-center font-bold">
        Sign up
      </Typography>
        <input
          type="text"
          placeholder="Username"
          value={username}
          maxLength={25}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          maxLength={25}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          maxLength={25}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
        />
        {error && (
        <Alert severity="error" variant="outlined" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}
        <Button type="submit" title="Register" variant="btn_dark_green_outline" />
        <p className="text-center">
          Вже маєте аккаунт? <Link className="regular-16 text-gray-50 cursor-pointer pb-1.5 transition-all hover:font-bold"href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;