import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import { listEventCategoriesAction } from 'src/auth/actions';

import { EventForm } from '../event-form';

export default async function CreateEventPage() {
  await requireSession('events.create');
  const categories = await listEventCategoriesAction();
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Buat event</Typography>
      <EventForm categories={categories.data ?? []} />
    </Stack>
  );
}
