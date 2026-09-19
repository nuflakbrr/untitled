import type { FC } from 'react';

import { notFound } from 'next/navigation';

import type { Event } from '@/interfaces/features/events';

import { getEventById } from '@/services/admin/events';

import EventForm from './_components/EventForm';

type Props = {
  params: Promise<{ id: string }>;
};

const EventDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const isNew = id === 'new';

  let initialData: Event | null = null;

  if (!isNew) {
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
