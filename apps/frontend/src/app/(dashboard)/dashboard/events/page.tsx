import type { Metadata } from 'next';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';

export const metadata: Metadata = { title: 'Event' };

export default async function EventsPage() {
  await requireSession('admin.access');

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
      <Typography variant="h4">Event</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Modul manajemen event akan dilanjutkan pada Sprint 7.2.
      </Typography>
    </Paper>
  );
}
