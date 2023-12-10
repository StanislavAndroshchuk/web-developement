'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { Alert, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
export default function History() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [warningMessage, setMessage] = useState('');
    const [successMessage, setMessageSucess] = useState('');
    
    useEffect(() => {
        
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        } 
        
        // Функція для завантаження історії
        const loadHistory = async () => {
          try {
            const response = await fetch('/api/history', {
              headers: {
                'Authorization': `${token}`
              }
            });
            if (!response.ok) {
              throw new Error('Не вдалося завантажити історію');
            }
            const data = await response.json();
            setTasks(data.tasks); // Встановлення завдань в стан
            // console.log(data.tasks)
            // console.log(tasks)
            // Перевірка чи всі задачі завершені
            const allCompleted = data.tasks.every((task) => task.progress === 100 );
            if (allCompleted) {
              clearInterval(intervalId);
            }


            const now = Date.now();
            const tasksToDelete = data.tasks.filter((task) => {
        
              
              return task.progress > 0 && task.progress < 100 && (now - task.start_time > 120000); // переконайтесь, що 10000 це бажаний інтервал
            });
          
            
            for (const task of tasksToDelete) {
              setMessage('Sorry! Task has been removed due to overtime')
              await handleDelete(task.id);
            }
            } catch (error) {
              setError('Не вдалося завантажити історію');
              //console.error(error);
            }
        };
        loadHistory();
        // const checkAndDeleteTasks = async () => {
        //   const now = Date.now();
        //   //console.log('Поточний час (now):', now);
        
        //   //console.log('Завдання перед фільтрацією:', tasks);
        //   const tasksToDelete = tasks.filter((task) => {
        //     const startTimeInMs = new Date(task.start_time).getTime();
        //     //console.log(`Завдання ID: ${task.id}, Start Time: ${task.start_time}, Start Time in MS: ${startTimeInMs}, Різниця: ${now - startTimeInMs}`);
        //     return task.progress > 0 && task.progress < 100 && (now - startTimeInMs > 10000); // переконайтесь, що 10000 це бажаний інтервал
        //   });
        
        //   //console.log('Завдання до видалення:', tasksToDelete);
        //   for (const task of tasksToDelete) {
        //     //console.log('Видалення завдання:', task);
        //     await handleDelete(task.id);
        //   }
        // };
        
        // Створення інтервалу для оновлення історії
        const intervalId = setInterval(() => {
          loadHistory();
          //checkAndDeleteTasks(); // Check if any tasks need to be deleted
        }, 1500);
      
        // Очищення інтервалу, коли компонент розмонтовується
        return () => clearInterval(intervalId);
      }, [router]);
    

    const handleDownload = async(task_id) =>{
        try {
            const response = await fetch('/api/actions', {
              method:'GET',
              headers: {
                'Authorization': `${task_id}`
              }
            });
            if (!response.ok) {
                throw new Error('Не вдалося завантажити файл');
              }
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = `task${task_id}.bin`; // Назва файлу, яку хочете задати при скачуванні
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(downloadUrl);
        }
        catch(error){
            setError('Не вдалося отримати файл');
            console.error(error);
        }
    };
    const handleDelete = async (taskId) => {
        try {
          const response = await fetch(`/api/actions`, {
            method: 'DELETE',
            headers: {
              'Authorization': `${taskId}`
            }
          });
          setMessageSucess('Task has been removed!')    
          // Update local state to remove the task from the list
          setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
          // You might want to fetch the updated list from the server instead
          // or trigger a re-fetch of the task list to ensure the UI is in sync with the server state
      
        } catch (error) {
          setError('Failed to delete task');
          console.error(error);
        }
      };

    return(
        <Box className="flexCenter flex-col mb-10">
            <Typography component="h1" variant="h5" className="flex justify-center font-bold">
                History
            </Typography>
            <Box>
              {warningMessage && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {warningMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage}
              </Alert>
            )}
            {error && <Alert severity="error">{error}</Alert>}
                <Table>
                    <TableHead>
                        <TableRow   >
                            <TableCell>Task ID</TableCell>
                            <TableCell>Progress</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.progress}%</TableCell>
                                {task.progress === 0 && <TableCell>Waiting in queue</TableCell>}
                                {task.progress === 100 && <TableCell>Finished</TableCell>}
                                {task.progress < 100 &&  task.progress > 0 && <TableCell>Calculating</TableCell>}
                                {task.progress === 100 && <TableCell className='gap-2'>
                                    <Button type="button" onClick={() => handleDownload(task.id)} title="GET" variant="btn_dark_green_outline2" />
                                    <Button type="button" onClick={() => handleDelete(task.id)} title="DEL" variant="btn_dark_green_outline2" />
                                </TableCell>}
                                {task.progress < 100 &&  task.progress >= 0 && <TableCell>
                                    <Button type="button" onClick={() => handleDelete(task.id)} title="DEL" variant="btn_dark_green_outline2" /></TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}