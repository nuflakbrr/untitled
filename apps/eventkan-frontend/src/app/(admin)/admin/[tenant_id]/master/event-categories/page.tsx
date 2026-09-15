'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteEventCategory,
  permanentlyDeleteEventCategory,
} from '@/services/admin/event-categories';

import Columns from './_components/Columns';
import { useEventCategoriesList } from './_components/useEventCategoriesList';

const EventCategoriesCMS: FC = () => {
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const { setPage, search, setLimit, categories, meta, isLoading, handleSearchChange } =
    useEventCategoriesList(includeDeleted);
  const { mutate: bulkDelete } = useMutation({
    mutationFn: (items: typeof categories) =>
      Promise.all(
        items.map((item) =>
          includeDeleted
            ? permanentlyDeleteEventCategory(item.id)
            : deleteEventCategory(item.id)
        )
      ),
    onSuccess: (results) => {
      const failed = results.find((result) => !result.success);
      if (failed) {
        toast.error(failed.error ?? 'Sebagian kategori gagal dihapus.');
        return;
      }
      toast.success('Kategori terpilih berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
    },
    onError: () => toast.error('Gagal menghapus kategori terpilih.'),
  });

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Kategori Event (${meta.total})`}
          description="Kelola kategori untuk mengelompokkan event berdasarkan jenisnya."
        />
        {hasPermission('event.categories.create') && (
          <Button asChild className="w-full sm:w-auto">
            <Link href={'/admin/master/event-categories/new' as Route}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Kategori
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={categories}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari kategori..."
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={setIncludeDeleted}
        onBulkDelete={bulkDelete}
      />
    </section>
  );
};

export default EventCategoriesCMS;
