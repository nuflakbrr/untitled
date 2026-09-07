'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getPaymentsFromRegistrations as getPayments } from '@/services/admin/payments';

export const usePaymentsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);
  const tenantId = usePathname().split('/')[2];

  const { data, isLoading } = useQuery({
    queryKey: ['payments', tenantId, page, limit, debouncedSearch],
    queryFn: () => getPayments(page, limit, debouncedSearch, tenantId),
  });

  const payments = data?.data || [];
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
    payments,
    meta,
    isLoading,
    handleSearchChange,
  };
};
