'use client';

import { useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { createReviewAction } from 'src/auth/actions';

export function ReviewForm({ registrationID }: { registrationID: string }) {
  const [state, action, pending] = useActionState(createReviewAction, { error: '', success: '' });
  return <Box component="form" action={action} sx={{ display: 'grid', gap: 1.5, mt: 1 }}>
    <input type="hidden" name="registration_id" value={registrationID} />
    {state.error ? <Alert severity="error">{state.error}</Alert> : null}
    {state.success ? <Alert severity="success">{state.success}</Alert> : null}
    <TextField select name="rating" label="Rating" defaultValue="5" size="small"><MenuItem value="5">★★★★★</MenuItem><MenuItem value="4">★★★★☆</MenuItem><MenuItem value="3">★★★☆☆</MenuItem><MenuItem value="2">★★☆☆☆</MenuItem><MenuItem value="1">★☆☆☆☆</MenuItem></TextField>
    <TextField required name="comment" label="Bagikan pengalamanmu" multiline minRows={3} size="small" />
    <Button type="submit" variant="contained" disabled={pending}>Kirim review</Button>
  </Box>;
}
