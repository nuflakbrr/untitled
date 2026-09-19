'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { EventWithCertificate } from '@/interfaces/features/certificates';

import { useDebounce } from '@/hooks/useDebounce';
import { getEventsWithCertificateEnabled } from '@/services/admin/certificates';

export function useCertificateTemplateEvents() {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce('', 500);
  const { data } = useQuery({
    queryKey: ['events-with-cert-enabled'],
    queryFn: getEventsWithCertificateEnabled,
  });

  const events: EventWithCertificate[] = data ?? [];
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return {
    events,
    filteredEvents,
    selectedEventId,
    selectedEvent: filteredEvents.find((event) => event.id === selectedEventId),
    setSelectedEventId,
    searchTerm,
    setSearchTerm: (value: string) => {
      setSearchTerm(value);
      setDebouncedSearchTerm(value);
    },
  };
}
