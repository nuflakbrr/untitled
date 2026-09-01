import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { requireSession } from 'src/auth/server';
import { listEventCategoriesAction } from 'src/auth/actions';

import { EventCategoryTable } from './event-category-table';
import { EventCategoryFlash } from './event-category-flash';

export const metadata: Metadata = { title: 'Kategori Event' };

export default async function EventCategoriesPage() {
  await requireSession('event.categories.read');
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
        {result.data ? (
          <EventCategoryTable rows={result.data} />
        ) : (
          <Typography color="error">{result.error}</Typography>
        )}
      </Paper>
    </Stack>
  );
}
