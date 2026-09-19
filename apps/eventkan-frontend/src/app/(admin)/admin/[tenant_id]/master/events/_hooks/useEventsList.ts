'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { useTenantId } from '@/hooks/useTenantId';
import { getEvents } from '@/services/admin/events';

export const useEventsList = (includeDeleted = false) => {
  const tenantId = useTenantId();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['events', tenantId, page, limit, debouncedSearch, includeDeleted],
    queryFn: () => getEvents(page, limit, debouncedSearch, includeDeleted),
  });

  const events = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
    setPage(1);
  };

  return {
    page,
    setPage,
    search,
    limit,
    setLimit,
    events,
    meta,
    isLoading,
    handleSearchChange,
  };
};
