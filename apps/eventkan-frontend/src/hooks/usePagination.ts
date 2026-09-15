'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function usePagination() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = useMemo(() => {
    const value = parseInt(searchParams.get('page') ?? '1', 10);
    return isNaN(value) ? 1 : value;
  }, [searchParams]);

  const size = useMemo(() => {
    const value = parseInt(searchParams.get('size') ?? '10', 10);
    return isNaN(value) ? 10 : value;
  }, [searchParams]);

  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const handleChangePage = (page: number) => {
    const newParams = new URLSearchParams(currentParams.toString());
    newParams.set('page', String(page));
    router.push(`?${newParams.toString()}`);
  };

  const handleChangeSize = (size: number) => {
    const newParams = new URLSearchParams(currentParams.toString());
    newParams.set('size', String(size));
    router.push(`?${newParams.toString()}`);
  };

  return {
    page,
    size,
    handleChangePage,
    handleChangeSize,
  };
}

export default usePagination;
