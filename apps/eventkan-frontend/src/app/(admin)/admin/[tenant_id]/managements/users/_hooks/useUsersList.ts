'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { useTenantId } from '@/hooks/useTenantId';
import { getUsers } from '@/services/admin/users';
import { getMeAction } from '@/services/public/auth';

export const useUsersList = (participantOnly: boolean, includeDeleted = false) => {
  const tenantId = useTenantId();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', tenantId, participantOnly, page, limit, debouncedSearch, includeDeleted],
    queryFn: () =>
      getUsers(page, limit, debouncedSearch, includeDeleted, participantOnly ? 'peserta' : ''),
  });
  const { data: meData } = useQuery({
    queryKey: ['auth-me-server-action'],
    queryFn: getMeAction,
    staleTime: 60_000,
  });
  const users = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
    setPage(1);
  };

  return {
    users,
    meta,
    isLoading,
    refetch,
    setPage,
    setLimit,
    search,
    handleSearchChange,
    currentUserId: meData?.session?.user?.id,
  };
};
