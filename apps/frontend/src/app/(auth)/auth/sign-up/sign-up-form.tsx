'use client';

import { useActionState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { signUpAction } from 'src/auth/actions';

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, { error: '' });
  return (
    <Box component="section">
      <Typography variant="h3">Buat akun SITIVENT</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5 }}>
        Daftar untuk menemukan dan mengikuti event kampus.
      </Typography>
      <Box component="form" action={action} sx={{ display: 'grid', gap: 2.5, mt: 4 }}>
        {state.error && <Alert severity="error">{state.error}</Alert>}
        <TextField
          required
          fullWidth
          name="name"
          label="Nama lengkap"
          autoComplete="name"
          autoFocus
        />
        <TextField
          required
          fullWidth
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
        />
        <TextField
          required
          fullWidth
          name="password"
          type="password"
          label="Kata sandi"
          autoComplete="new-password"
          slotProps={{ htmlInput: { minLength: 8 } }}
        />
        <TextField
          required
          fullWidth
          name="confirmation"
          type="password"
          label="Konfirmasi kata sandi"
          autoComplete="new-password"
          slotProps={{ htmlInput: { minLength: 8 } }}
        />
        <Button type="submit" size="large" variant="contained" disabled={pending}>
          {pending ? <CircularProgress size={24} color="inherit" /> : 'Daftar'}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Sudah punya akun?{' '}
          <Link component={RouterLink} href={paths.auth.signIn}>
            Masuk
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
