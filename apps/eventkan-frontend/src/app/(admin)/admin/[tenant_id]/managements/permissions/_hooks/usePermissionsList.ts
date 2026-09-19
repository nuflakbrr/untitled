'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { getPermissions } from '@/services/admin/permissions';

export const usePermissionsList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['permissions', page, limit, debouncedSearch],
    queryFn: () => getPermissions(page, limit, debouncedSearch),
  });

  return {
    permissions: data?.data ?? [],
    meta: data?.meta ?? { total: 0, page: 1, lastPage: 1 },
    isLoading,
    refetch,
    search,
    setPage,
    setLimit,
    handleSearchChange: (value: string) => {
      setSearch(value);
      setDebouncedSearch(value);
      setPage(1);
    },
  };
};
