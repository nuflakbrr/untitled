'use client';

import { useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';

import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import { changePasswordAction } from 'src/auth/actions';

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, { error: '', success: '' });
  return (
    <Box component="form" action={action} sx={{ display: 'grid', gap: 2 }}>
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      {state.success ? <Alert severity="success">{state.success}</Alert> : null}
      <TextField required name="current_password" label="Kata sandi saat ini" type="password" />
      <TextField required name="new_password" label="Kata sandi baru" type="password" />
      <TextField required name="confirmation" label="Konfirmasi kata sandi baru" type="password" />
      <ConfirmSubmitButton
        title="Ubah kata sandi?"
        description="Setelah berhasil, sesi akan dikeluarkan dan kamu harus login kembali."
        variant="outlined"
        disabled={pending}
      >
        Ubah kata sandi
      </ConfirmSubmitButton>
    </Box>
  );
}
