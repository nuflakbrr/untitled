import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';

import { GalleryForm } from '../gallery-form';

export default async function CreateGalleryPage() {
  await requireSession('galleries.create');
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Tambah galeri</Typography>
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, md: 4 }, width: { xs: '100%', md: '50%' }, borderRadius: 2 }}
      >
        <GalleryForm />
      </Paper>
    </Stack>
  );
}
