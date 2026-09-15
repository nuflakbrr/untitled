'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';

import Columns from './_components/Columns';
import { useEventsList } from './_components/useEventsList';

const EventsCMS: FC = () => {
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { hasPermission } = usePermission();
  const { setPage, search, setLimit, events, meta, isLoading, handleSearchChange } =
    useEventsList(includeDeleted);

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Manajemen Event (${meta.total})`}
          description="Kelola daftar seminar, workshop, webinar, dan event lainnya."
        />
        {hasPermission('events.create') && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/master/events/new">
              <Plus className="h-4 w-4 mr-2" /> Tambah Event
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="title"
        columns={Columns}
        data={events}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari event..."
        includeDeleted={includeDeleted}
        onIncludeDeletedChange={setIncludeDeleted}
      />
    </section>
  );
};

export default EventsCMS;
