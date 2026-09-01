import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { requireSession } from 'src/auth/server';
import { listEventCategoriesAction } from 'src/auth/actions';

import { EventCategoryTable } from './event-category-table';
import { EventCategoryFlash } from './event-category-flash';

export const metadata: Metadata = { title: 'Kategori Event' };

export default async function EventCategoriesPage() {
  const session = await requireSession('events.read');
  const result = await listEventCategoriesAction();
  return (
    <Stack spacing={3}>
      <EventCategoryFlash />
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}
      >
        <Box>
          <Typography variant="h4">Kategori event</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Kelola kategori untuk mengelompokkan event.
          </Typography>
        </Box>
        <Button component="a" href={paths.dashboard.eventCategoriesCreate} variant="contained">
          Tambah kategori
        </Button>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflow: 'hidden' }}>
        <Chip label={session.tenant?.name ?? 'Universitas'} size="small" sx={{ mb: 2 }} />
        {result.data ? (
          <EventCategoryTable rows={result.data} />
        ) : (
          <Typography color="error">{result.error}</Typography>
        )}
      </Paper>
    </Stack>
  );
}
