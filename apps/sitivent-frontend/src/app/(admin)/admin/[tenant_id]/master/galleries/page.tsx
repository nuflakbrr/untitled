'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';

import Columns from './_components/Columns';
import { useGalleriesList } from './_components/useGalleriesList';

const GalleriesCMS: FC = () => {
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
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Galeri Foto (${meta.total})`}
          description="Kelola dokumentasi foto event untuk dipublikasikan pada website."
        />
        {hasPermission('galleries.create') && (
          <Button asChild className="w-full sm:w-auto">
            <Link href={'/admin/master/galleries/new' as Route}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Foto
            </Link>
          </Button>
        )}
      </div>
      <Separator />
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
      />
    </section>
  );
};

export default GalleriesCMS;
