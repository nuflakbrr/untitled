'use client';

import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { searchEventsAction, type EventSearchResult } from 'src/auth/actions';

export function EventSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [isApple, setIsApple] = useState(false);
  const [results, setResults] = useState<EventSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const apple = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsApple(apple);
    const handleShortcut = (event: KeyboardEvent) => {
      if ((apple ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);
  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);
  useEffect(() => {
    if (!open) {
      setResults([]);
      return undefined;
    }
    if (!query.trim()) {
      setLoading(true);
      searchEventsAction('').then((response) => {
        setResults(response.data ?? []);
        setLoading(false);
      });
      return undefined;
    }
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const response = await searchEventsAction(query);
      setResults(response.data ?? []);
      setLoading(false);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [open, query]);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    setOpen(false);
    router.push(
      value ? `${paths.event.root}?search=${encodeURIComponent(value)}` : paths.event.root
    );
  }
  return (
    <>
      <Box
        component="button"
        type="button"
        onClick={() => setOpen(true)}
        sx={{
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          gap: 1,
          width: 255,
          height: 40,
          px: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 99,
          color: 'text.secondary',
          bgcolor: 'transparent',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <Iconify icon="carbon:search" width={20} />
        <Typography variant="body2" sx={{ flex: 1 }}>
          Cari event
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {isApple ? '⌘ K' : 'Ctrl K'}
        </Typography>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { width: 'min(560px, calc(100% - 32px))', borderRadius: 3 } } }}
      >
        <DialogContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box component="form" onSubmit={submit} sx={{ display: 'grid', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                minHeight: 52,
                px: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
              }}
            >
              <Iconify icon="carbon:search" width={24} />
              <InputBase
                inputRef={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari event berdasarkan nama..."
                autoFocus
                inputProps={{ 'aria-label': 'Cari event' }}
                sx={{ flex: 1 }}
              />
            </Box>
            {!query.trim() && (
              <Typography variant="subtitle2" color="text.secondary">
                Event yang mungkin kamu cari
              </Typography>
            )}
            {loading && (
              <Typography variant="body2" color="text.secondary">
                Mencari event...
              </Typography>
            )}
            {!loading && query.trim() && results.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Event tidak ditemukan.
              </Typography>
            )}
            {results.map((event) => (
              <Box
                key={event.id}
                component="button"
                type="button"
                onClick={() => router.push(`${paths.event.root}/${event.slug}`)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  border: 0,
                  bgcolor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Box
                  component="img"
                  src={event.banner ?? '/sitivent-mark.svg'}
                  alt=""
                  sx={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 1 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {event.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
