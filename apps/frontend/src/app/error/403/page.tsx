'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

export default function ForbiddenPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeContent: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1">403</Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>
        Akses ditolak
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Akun Anda tidak memiliki izin untuk membuka halaman ini.
      </Typography>
      <Button component={RouterLink} href="/dashboard" variant="contained">
        Kembali ke dashboard
      </Button>
    </Box>
  );
}
