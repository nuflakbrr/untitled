'use client';

import { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';

export function AdminFlash() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )admin_flash=([^;]*)/);
    if (!match?.[1]) return;
    setMessage(decodeURIComponent(match[1]));
    document.cookie = 'admin_flash=; Max-Age=0; path=/dashboard';
  }, []);
  return message ? <Alert severity="success">{message}</Alert> : null;
}
