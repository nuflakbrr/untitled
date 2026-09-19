'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { getTenants } from '@/services/admin/tenants';

export const useTenantsList = (includeDeleted = false) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-tenants', page, limit, debouncedSearch, includeDeleted],
    queryFn: () => getTenants(page, limit, debouncedSearch, includeDeleted),
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
    setPage(1);
  };

  return { data, isLoading, refetch, setPage, setLimit, search, handleSearchChange };
};
