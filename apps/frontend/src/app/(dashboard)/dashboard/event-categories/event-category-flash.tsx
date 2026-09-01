'use client';

import { useState, useEffect } from 'react';

import Alert from '@mui/material/Alert';

export function EventCategoryFlash() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )event_category_flash=([^;]*)/);
    if (!match?.[1]) return;
    setMessage(decodeURIComponent(match[1]));
    document.cookie = 'event_category_flash=; Max-Age=0; path=/dashboard/event-categories';
  }, []);
  return message ? <Alert severity="success">{message}</Alert> : null;
}
