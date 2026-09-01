'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useRef, useState, useEffect, useTransition } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { scanAttendanceAction, type AttendanceScanResult } from 'src/auth/actions';

export function AttendanceScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerRunningRef = useRef(false);
  const scanHandledRef = useRef(false);
  const [qrValue, setQrValue] = useState('');
  const [result, setResult] = useState<AttendanceScanResult | null>(null);
  const [error, setError] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [progress, setProgress] = useState(0);
  const [pending, startTransition] = useTransition();

  useEffect(
    () => () => {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner && scannerRunningRef.current) {
        scannerRunningRef.current = false;
        void scanner.stop().catch(() => undefined);
      }
    },
    []
  );
  const validate = (value: string) => {
    const [eventID, qrToken] = value.trim().split('|');
    if (!eventID || !qrToken) {
      setError('QR tiket tidak memiliki format yang valid.');
      return;
    }
    setError('');
    setResult(null);
    setProgress(15);
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 180));
      setProgress(40);
      const response = await scanAttendanceAction(eventID, qrToken);
      setProgress(82);
      await new Promise((resolve) => setTimeout(resolve, 220));
      if (response.error) setError(response.error);
      else {
        setResult(response.data);
        setQrValue('');
      }
      setProgress(100);
      window.setTimeout(() => setProgress(0), 500);
    });
  };
  const stopCamera = async () => {
    if (cameraBusy) return;
    setCameraBusy(true);
    const scanner = scannerRef.current;
    scannerRef.current = null;
    setCameraOpen(false);
    if (!scanner || !scannerRunningRef.current) {
      setCameraBusy(false);
      return;
    }
    scannerRunningRef.current = false;
    try {
      await scanner.stop();
    } catch {
      // The scanner may already have stopped after a successful decode.
    } finally {
      setCameraBusy(false);
    }
  };
  const getCameraErrorMessage = (cause: unknown) => {
    const cameraCause = cause as { name?: string; message?: string };
    const name = cameraCause.name ?? '';
    const message = cameraCause.message?.toLowerCase() ?? '';
    if (
      ['NotAllowedError', 'SecurityError'].includes(name) ||
      message.includes('permission denied') ||
      message.includes('not allowed')
    ) {
      return 'Izin kamera belum diberikan. Klik ikon pengaturan di address bar, ubah Camera menjadi Allow, lalu reload halaman.';
    }
    if (name === 'NotFoundError' || message.includes('camera not found')) {
      return 'Kamera tidak ditemukan pada perangkat ini.';
    }
    if (
      ['NotReadableError', 'AbortError'].includes(name) ||
      message.includes('could not start video source') ||
      message.includes('device in use')
    ) {
      return 'Kamera sedang digunakan aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.';
    }
    if (name === 'OverconstrainedError' || message.includes('overconstrained')) {
      return 'Kamera belakang tidak tersedia. Coba gunakan kamera lain atau masukkan token QR manual.';
    }
    if (!window.isSecureContext) {
      return 'Kamera hanya dapat digunakan melalui HTTPS. Buka halaman melalui alamat HTTPS lalu coba lagi.';
    }
    return 'Kamera gagal dibuka. Periksa izin kamera dan koneksi HTTPS, lalu coba lagi.';
  };
  const startCamera = async () => {
    if (scannerRef.current || !navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Browser atau perangkat ini tidak mendukung akses kamera. Masukkan token QR manual.'
      );
      return;
    }
    setCameraError('');
    scanHandledRef.current = false;
    setCameraBusy(true);
    try {
      const permissionStream = await navigator.mediaDevices.getUserMedia({ video: true });
      permissionStream.getTracks().forEach((track) => track.stop());

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decoded) => {
          if (scanHandledRef.current) return;
          scanHandledRef.current = true;
          validate(decoded);
          window.setTimeout(() => {
            scanHandledRef.current = false;
          }, 1500);
        },
        () => undefined
      );
      scannerRunningRef.current = true;
      setCameraOpen(true);
    } catch (cause) {
      scannerRef.current = null;
      setCameraOpen(false);
      setCameraError(getCameraErrorMessage(cause));
    } finally {
      setCameraBusy(false);
    }
  };
  return (
    <Box sx={{ display: 'grid', gap: 2.5, maxWidth: 760 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        <Stack spacing={2.5}>
          <Typography variant="h5">Verifikasi tiket</Typography>
          {cameraError ? <Alert severity="warning">{cameraError}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          {result ? (
            <Alert severity="success">{result.participant_name} berhasil check-in.</Alert>
          ) : null}
          <Box
            id="qr-reader"
            sx={{
              width: '100%',
              aspectRatio: { xs: '1 / 1', sm: '4 / 3' },
              overflow: 'hidden',
              borderRadius: 2,
              bgcolor: 'grey.900',
              '& video': {
                width: '100% !important',
                height: '100% !important',
                display: 'block',
                objectFit: 'cover',
              },
              '& canvas': { maxWidth: '100%' },
              '& #qr-shaded-region': {
                borderWidth: { xs: '3px', sm: '4px' },
                borderStyle: 'solid',
                borderColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 2,
              },
            }}
          />
          {!cameraOpen ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: -1 }}>
              Arahkan kamera ke QR code tiket
            </Typography>
          ) : null}
          <Button
            variant="outlined"
            onClick={cameraOpen ? stopCamera : startCamera}
            disabled={pending || cameraBusy}
          >
            {cameraBusy
              ? 'Menyiapkan kamera...'
              : cameraOpen
                ? 'Tutup kamera'
                : 'Buka kamera untuk scan QR'}
          </Button>
          {progress > 0 ? (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Memvalidasi tiket...
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.5 }} />
            </Box>
          ) : null}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Masukkan token secara manual</Typography>
          <TextField
            fullWidth
            label="Token QR tiket"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') validate(qrValue);
            }}
            helperText="Gunakan scan kamera atau tempel token QR."
          />
          <Button
            variant="contained"
            onClick={() => validate(qrValue)}
            disabled={pending || !qrValue.trim()}
          >
            {pending ? 'Memvalidasi...' : 'Proses check-in'}
          </Button>
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
