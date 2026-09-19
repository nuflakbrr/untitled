'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useTenantId } from '@/hooks/useTenantId';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';

import Columns from './_components/Columns';
import { useEventsList } from './_hooks/useEventsList';

const EventsCMS: FC = () => {
  const tenantId = useTenantId();
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const { hasPermission } = usePermission();
  const { setPage, search, setLimit, events, meta, isLoading, handleSearchChange } =
    useEventsList(includeDeleted);

  return (
    <section className="mx-auto w-full max-w-375">
      <Heading
        variant="soft"
        title="Manajemen Event"
        titleSuffix={`(${meta.total})`}
        description="Kelola daftar seminar, workshop, webinar, dan event lainnya."
        action={
          hasPermission('events.create') ? (
            <Button
              asChild
              className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto"
            >
              <Link href={`/admin/${tenantId}/master/events/new`}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Event
              </Link>
            </Button>
          ) : null
        }
      />
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
        onIncludeDeletedChange={(value) => {
          setIncludeDeleted(value);
          setPage(1);
        }}
        variant="eventkan"
      />
    </section>
  );
};

export default EventsCMS;
