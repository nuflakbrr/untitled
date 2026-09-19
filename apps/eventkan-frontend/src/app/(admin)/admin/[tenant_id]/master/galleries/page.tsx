'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useTenantId } from '@/hooks/useTenantId';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';

import Columns from './_components/Columns';
import { useGalleriesList } from './_hooks/useGalleriesList';

const GalleriesCMS: FC = () => {
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const {
    setPage,
    search,
    setLimit,
    galleries,
    meta,
    isLoading,
    handleSearchChange,
    includeDeleted,
    setIncludeDeleted,
  } = useGalleriesList();

  return (
    <section className="mx-auto w-full max-w-375">
      <Heading
        variant="soft"
        title="Galeri Foto"
        titleSuffix={`(${meta.total})`}
        description="Kelola dokumentasi foto event untuk dipublikasikan pada website."
        action={
          hasPermission('galleries.create') ? (
            <Button
              asChild
              className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto"
            >
              <Link href={`/admin/${tenantId}/master/galleries/new` as Route}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Foto
              </Link>
            </Button>
          ) : null
        }
      />
      <DataTable
        searchKey="title"
        columns={Columns}
        data={galleries}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari judul atau deskripsi foto..."
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={(value) => {
          setIncludeDeleted(value);
          setPage(1);
        }}
        variant="eventkan"
      />
    </section>
  );
};

export default GalleriesCMS;
