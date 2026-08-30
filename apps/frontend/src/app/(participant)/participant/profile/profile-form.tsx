'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import { updateMyProfileAction } from 'src/auth/actions';

export function ParticipantProfileForm({ name, image }: { name: string; image?: string | null }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateMyProfileAction, {
    error: '',
    success: '',
  });

  useEffect(() => {
    if (state.success) router.refresh();
  }, [router, state.success]);

  return (
    <Box component="form" action={action} sx={{ display: 'grid', gap: 2.5 }}>
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      {state.success ? <Alert severity="success">{state.success}</Alert> : null}
      <TextField required name="name" label="Nama lengkap" defaultValue={name} />
      <TextField
        name="image"
        label="URL foto profil"
        defaultValue={image ?? ''}
        placeholder="https://..."
        helperText="Opsional. Gunakan URL gambar yang dapat diakses publik."
      />
      <Button type="submit" variant="contained" disabled={pending} sx={{ justifySelf: 'start' }}>
        {pending ? <CircularProgress size={22} color="inherit" /> : 'Simpan perubahan'}
      </Button>
    </Box>
  );
}
