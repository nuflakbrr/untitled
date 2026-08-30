'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

export default function CertificatesPage() {
  const [identifier, setIdentifier] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = identifier.trim();
    if (value)
      window.location.assign(
        `${paths.certificates.verify}/${value.split('/').map(encodeURIComponent).join('/')}`
      );
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 10, md: 16 } }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, md: 7 },
          borderRadius: 3,
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Stack spacing={3} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              color: 'primary.main',
              bgcolor: 'primary.lighter',
            }}
          >
            <Iconify icon="solar:diploma-verified-bold-duotone" width={32} />
          </Box>
          <Box>
            <Typography variant="overline" color="primary.main">
              Verifikasi resmi
            </Typography>
            <Typography variant="h1" sx={{ mt: 1, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
              Cek sertifikat SITIVENT
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 560, mx: 'auto' }}>
              Pastikan sertifikat event terdaftar dan diterbitkan secara resmi oleh penyelenggara.
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 620 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                fullWidth
                label="Nomor atau identifier sertifikat"
                placeholder="Contoh: CERT/FT/event/REG-001"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
              />
              <Button type="submit" variant="contained" size="large" sx={{ minWidth: 150 }}>
                Verifikasi
              </Button>
            </Stack>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Gunakan nomor yang tercetak pada sertifikat atau pindai QR verifikasi.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
