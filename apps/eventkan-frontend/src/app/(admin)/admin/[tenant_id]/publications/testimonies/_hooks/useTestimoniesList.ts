'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { getTestimonies } from '@/services/admin/testimonials';
import { getEventsForFilter } from '@/services/admin/registrations';

export const useTestimoniesList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [eventId, setEventId] = useState<string | undefined>();
  const { data, isLoading } = useQuery({
    queryKey: ['testimonies', page, limit, debouncedSearch, eventId],
    queryFn: () => getTestimonies(page, limit, debouncedSearch, eventId),
  });
  const { data: eventsData } = useQuery({
    queryKey: ['events-for-filter'],
    queryFn: getEventsForFilter,
  });

  return {
    testimonies: data?.data ?? [],
    meta: data?.meta ?? { total: 0, page: 1, lastPage: 1 },
    events: eventsData?.data ?? [],
    eventId,
    setPage,
    setLimit,
    setEventId: (value?: string) => {
      setEventId(value);
      setPage(1);
    },
    search,
    isLoading,
    handleSearchChange: (value: string) => {
      setSearch(value);
      setDebouncedSearch(value);
      setPage(1);
    },
  };
};
