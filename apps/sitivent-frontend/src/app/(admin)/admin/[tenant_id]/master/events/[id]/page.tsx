import type { FC } from 'react';
import type { Event } from '@/interfaces/features/events';

import { notFound } from 'next/navigation';
import { getEventById } from '@/services/admin/events';

import EventForm from './_components/EventForm';

type Props = {
  params: Promise<{ id: string }>;
};

const EventDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const isEdit = id !== 'new';

  let initialData: Event | null = null;

  if (isEdit) {
    const result = await getEventById(id);
    if (result.success && result.data) {
      initialData = result.data as Event;
    } else {
      return notFound();
    }
  }

  return <EventForm initialData={initialData} />;
};

export default EventDetailCMS;
