import { notFound } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { requireSession } from 'src/auth/server';
import { listEventCategoriesAction } from 'src/auth/actions';
import { EventCategoryForm } from '../../event-category-form';

export default async function EditEventCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession('events.update');
  const { id } = await params;
  const result = await listEventCategoriesAction();
  const category = result.data?.find((item) => item.id === id);
  if (!category) notFound();
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Edit kategori event</Typography>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 } }}>
        <EventCategoryForm category={category} />
      </Paper>
    </Stack>
  );
}
