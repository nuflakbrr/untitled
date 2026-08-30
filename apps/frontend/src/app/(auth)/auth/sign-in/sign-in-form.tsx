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

import { signInAction } from 'src/auth/actions';

export function SignInForm({ returnTo }: { returnTo: string }) {
  const [state, action, pending] = useActionState(signInAction, { error: '' });

  return (
    <Box component="section">
      <Typography variant="h3">Selamat datang kembali</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5 }}>
        Masuk untuk mengelola event universitas dan fakultas Anda.
      </Typography>

      <Box component="form" action={action} sx={{ display: 'grid', gap: 2.5, mt: 4 }}>
        <input type="hidden" name="returnTo" value={returnTo} />
        {state.error && <Alert severity="error">{state.error}</Alert>}
        <TextField
          required
          fullWidth
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          required
          fullWidth
          name="password"
          type="password"
          label="Kata sandi"
          autoComplete="current-password"
          slotProps={{ htmlInput: { minLength: 8 } }}
        />
        <Button type="submit" size="large" variant="contained" disabled={pending}>
          {pending ? <CircularProgress size={24} color="inherit" /> : 'Masuk'}
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Belum punya akun?{' '}
          <Link href={paths.auth.signUp} underline="hover" sx={{ fontWeight: 700 }}>
            Daftar sekarang
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
