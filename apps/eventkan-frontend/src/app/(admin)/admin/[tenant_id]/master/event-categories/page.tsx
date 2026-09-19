'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';
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
          includeDeleted ? permanentlyDeleteEventCategory(item.id) : deleteEventCategory(item.id)
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
    <section className="mx-auto w-full max-w-375">
      <Heading
        variant="soft"
        title="Kategori Event"
        titleSuffix={`(${meta.total})`}
        description="Kelola kategori untuk mengelompokkan event berdasarkan jenisnya."
        action={
          hasPermission('event.categories.create') ? (
            <Button
              asChild
              className="w-full rounded-xl bg-eventkan-navy px-4 font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto"
            >
              <Link href={'/admin/master/event-categories/new' as Route}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
              </Link>
            </Button>
          ) : null
        }
      />
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
        variant="eventkan"
      />
    </section>
  );
};

export default EventCategoriesCMS;
