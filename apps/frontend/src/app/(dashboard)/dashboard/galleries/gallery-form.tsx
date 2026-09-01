'use client';

import { useState, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';

import { galleryCrudAction } from 'src/auth/actions';

export function GalleryForm({
  gallery,
}: {
  gallery?: {
    id: string;
    title: string;
    description?: string | null;
    image_url: string;
    featured: boolean;
  };
}) {
  const [state, action, pending] = useActionState(galleryCrudAction, { error: '', success: '' });
  const [image, setImage] = useState(gallery?.image_url ?? '');
  return (
    <Box component="form" action={action} sx={{ display: 'grid', gap: 2, maxWidth: 720 }}>
      {gallery && <input type="hidden" name="id" value={gallery.id} />}{' '}
      {state.error && <Alert severity="error">{state.error}</Alert>}
      <TextField name="title" label="Judul galeri" defaultValue={gallery?.title ?? ''} required />
      <TextField
        name="description"
        label="Deskripsi"
        defaultValue={gallery?.description ?? ''}
        multiline
        minRows={3}
      />
      <TextField
        name="image_url"
        label="URL gambar"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />
      <TextField name="event_id" label="ID event (opsional)" />
      <FormControlLabel
        control={<Checkbox name="featured" defaultChecked={gallery?.featured} />}
        label="Tampilkan sebagai unggulan"
      />
      {image && (
        <Box
          component="img"
          src={image}
          alt="Preview gambar"
          sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2 }}
        />
      )}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button type="submit" variant="contained" disabled={pending}>
          Simpan
        </Button>
        <Button component="a" href="/dashboard/galleries">
          Batal
        </Button>
      </Box>
    </Box>
  );
}
