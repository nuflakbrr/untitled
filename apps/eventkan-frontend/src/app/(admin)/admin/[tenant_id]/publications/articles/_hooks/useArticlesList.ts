'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/hooks/useDebounce';
import { getArticles } from '@/services/admin/articles';

export const useArticlesList = (includeDeleted = false) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(10);

  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['articles', page, limit, debouncedSearch, includeDeleted],
    queryFn: () => getArticles(page, limit, debouncedSearch, includeDeleted),
  });
  const articles = articlesData?.data || [];
  const meta = articlesData?.meta || { total: 0, page: 1, lastPage: 0 };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
    setPage(1);
  };

  return { articles, meta, isLoading, setPage, setLimit, search, handleSearchChange };
};
