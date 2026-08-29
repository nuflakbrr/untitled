'use client';

import { useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { signInAction } from 'src/auth/actions';

export function SignInForm({ returnTo }: { returnTo: string }) {
  const [state, action, pending] = useActionState(signInAction, { error: '' });

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 440,
        p: { xs: 3, sm: 5 },
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="overline" color="primary.main">
        SITIVENT
      </Typography>
      <Typography variant="h3" sx={{ mt: 1 }}>
        Selamat datang kembali
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5 }}>
        Masuk untuk mengelola event universitas dan fakultas Anda.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Box component="form" action={action} sx={{ display: 'grid', gap: 2.5 }}>
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
      </Box>
    </Paper>
  );
}
