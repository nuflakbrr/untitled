'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import Heading from '@/components/Common/Heading';
import { getTenants } from '@/services/admin/tenants';
import { DataTable } from '@/components/ui/data-table';

import Columns from './_components/Columns';

export default function TenantsCMS() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const tenantId = usePathname().split('/')[2];
  const { data, isLoading } = useQuery({
    queryKey: ['admin-tenants', page, limit, debouncedSearch],
    queryFn: () => getTenants(page, limit, debouncedSearch),
  });

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <Heading
          title={`Tenant (${data?.meta.total ?? 0})`}
          description="Kelola organisasi dan unit kerja dalam SITIVENT."
        />
        <Button asChild>
          <Link href={`/admin/${tenantId}/managements/tenants/new`}>Tambah Tenant</Link>
        </Button>
      </div>
      <DataTable
        columns={Columns}
        data={data?.data ?? []}
        isFetching={isLoading}
        pageCount={data?.meta.lastPage ?? 1}
        onPageChange={setPage}
        onLimitChange={(value) => {
          setLimit(value);
          setPage(1);
        }}
        onSearchChange={(value) => {
          setSearch(value);
          setDebouncedSearch(value);
          setPage(1);
        }}
        searchValue={search}
        searchKey="name"
      />
    </section>
  );
}
