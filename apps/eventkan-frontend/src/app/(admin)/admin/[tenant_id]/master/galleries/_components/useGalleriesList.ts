'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getGalleries } from '@/services/admin/galleries';

export const useGalleriesList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(10);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['galleries', page, limit, debouncedSearch, includeDeleted],
    queryFn: () => getGalleries(page, limit, debouncedSearch, undefined, includeDeleted),
  });

  const galleries = data?.data || [];
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
    galleries,
    meta,
    isLoading,
    handleSearchChange,
    includeDeleted,
    setIncludeDeleted,
  };
};
