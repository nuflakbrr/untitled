'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { getUsers } from '@/services/admin/users';

export const useUsersList = (participantOnly: boolean, includeDeleted = false) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', participantOnly, page, limit, debouncedSearch, includeDeleted],
    queryFn: () =>
      getUsers(page, limit, debouncedSearch, includeDeleted, participantOnly ? 'peserta' : ''),
  });
  const users = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
    setPage(1);
  };

  return { users, meta, isLoading, refetch, setPage, setLimit, search, handleSearchChange };
};
