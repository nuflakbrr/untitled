import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { requireSession } from 'src/auth/server';
import { EventCategoryForm } from '../event-category-form';

export default async function CreateEventCategoryPage() {
  await requireSession('events.create');
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Tambah kategori event</Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 } }}>
        <EventCategoryForm />
      </Paper>
    </Stack>
  );
}
