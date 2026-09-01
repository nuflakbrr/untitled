import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { requireSession } from 'src/auth/server';
import { listAdminEventsAction } from 'src/auth/actions';

import { EventTable } from './event-table';

export const metadata: Metadata = { title: 'Event' };

export default async function EventsPage() {
  await requireSession('admin.access');
  const result = await listAdminEventsAction();

  return (
    <Box>
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          mb: 3,
          alignItems: { sm: 'flex-end' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box>
          <Typography variant="h3">Manajemen event</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Susun dan publikasikan agenda untuk tenant aktif.
          </Typography>
        </Box>
        <Button variant="contained" component="a" href={paths.dashboard.eventsCreate}>
          Buat event
        </Button>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflow: 'hidden' }}>
        {result.data?.length ? (
          <EventTable rows={result.data} />
        ) : (
          <Typography color={result.error ? 'error' : 'text.secondary'}>
            {result.error || 'Belum ada event.'}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
