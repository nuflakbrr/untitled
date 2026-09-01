import { notFound } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import { listAdminEventsAction, listEventCategoriesAction } from 'src/auth/actions';

import { EventForm } from '../../event-form';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireSession('events.update');
  const { id } = await params;
  const result = await listAdminEventsAction();
  const categories = await listEventCategoriesAction();
  const event = result.data?.find((item) => item.id === id);
  if (!event) notFound();
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Edit event</Typography>
      <EventForm event={event} categories={categories.data ?? []} />
    </Stack>
  );
}
