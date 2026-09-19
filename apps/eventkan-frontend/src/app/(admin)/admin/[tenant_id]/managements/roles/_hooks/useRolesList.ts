'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { getRoles } from '@/services/admin/roles';

export const useRolesList = (includeDeleted = false) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['roles', page, limit, debouncedSearch, includeDeleted],
    queryFn: () => getRoles(page, limit, debouncedSearch, includeDeleted),
  });

  return {
    roles: (data?.data ?? []).filter((role) => (includeDeleted ? !!role.deletedAt : !role.deletedAt)),
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
