'use client';

import { useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { RouterLink } from 'src/routes/components';

import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import { eventCategoryCrudAction } from 'src/auth/actions';

export function EventCategoryForm({
  category,
}: {
  category?: { id: string; name: string; description?: string | null };
}) {
  const [state, action, pending] = useActionState(eventCategoryCrudAction, {
    error: '',
    success: '',
  });
  return (
    <Box component="form" action={action} sx={{ display: 'grid', gap: 2, maxWidth: 720 }}>
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      {state.success ? <Alert severity="success">{state.success}</Alert> : null}
      <TextField name="name" label="Nama kategori" defaultValue={category?.name ?? ''} required />
      <TextField
        name="description"
        label="Deskripsi"
        defaultValue={category?.description ?? ''}
        multiline
        minRows={3}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        {category ? (
          <ConfirmSubmitButton
            title="Simpan perubahan?"
            description="Perubahan kategori akan diterapkan pada event terkait."
            disabled={pending}
          >
            Simpan
          </ConfirmSubmitButton>
        ) : (
          <Button type="submit" variant="contained" disabled={pending}>
            Simpan
          </Button>
        )}
        <Button component={RouterLink} href="/dashboard/event-categories">
          Batal
        </Button>
      </Box>
    </Box>
  );
}
