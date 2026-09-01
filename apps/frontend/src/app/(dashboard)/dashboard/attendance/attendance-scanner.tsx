'use client';

import { useState, useTransition } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import { scanAttendanceAction, type AttendanceScanResult } from 'src/auth/actions';

type Event = { id: string; title: string; status: string };

export function AttendanceScanner({ events }: { events: Event[] }) {
  const [eventID, setEventID] = useState(events[0]?.id ?? '');
  const [qrToken, setQrToken] = useState('');
  const [result, setResult] = useState<AttendanceScanResult | null>(null);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError('');
    setResult(null);
    startTransition(async () => {
      const response = await scanAttendanceAction(eventID, qrToken.trim());
      if (response.error) setError(response.error);
      else {
        setResult(response.data);
        setQrToken('');
      }
    });
  };

  return (
    <Box sx={{ display: 'grid', gap: 2.5, maxWidth: 760 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        <Stack spacing={2.5}>
          <Typography variant="h5">Verifikasi tiket</Typography>
          <FormControl fullWidth>
            <InputLabel id="scan-event-label">Event</InputLabel>
            <Select
              labelId="scan-event-label"
              label="Event"
              value={eventID}
              onChange={(e) => setEventID(e.target.value)}
            >
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Token QR tiket"
            placeholder="Scan atau tempel token QR peserta"
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
          <Button
            variant="contained"
            onClick={submit}
            disabled={pending || !eventID || !qrToken.trim()}
          >
            {pending ? 'Memproses...' : 'Proses check-in'}
          </Button>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {result ? (
            <Alert severity="success">{result.participant_name} berhasil check-in.</Alert>
          ) : null}
        </Stack>
      </Paper>
      {result ? (
        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
          <Typography variant="h6">Detail peserta</Typography>
          <Typography sx={{ mt: 1 }}>{result.participant_name}</Typography>
          <Typography color="text.secondary">{result.participant_email}</Typography>
          <Typography color="text.secondary">
            Nomor registrasi: {result.registration_number}
          </Typography>
        </Paper>
      ) : null}
    </Box>
  );
}
