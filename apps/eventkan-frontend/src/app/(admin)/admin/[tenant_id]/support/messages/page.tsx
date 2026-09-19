'use client';

import type { FC } from 'react';

import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

import Columns from './_components/Columns';
import { useSupportMessagesList } from './_hooks/useSupportMessagesList';

const SupportMessagesPage: FC = () => {
  const {
    setPage,
    search,
    setLimit,
    messages,
    meta,
    isLoading,
    handleSearchChange,
    statusFilter,
    setStatusFilter,
  } = useSupportMessagesList();

  return (
    <section className="mx-auto w-full max-w-375">
      <Heading
        variant="soft"
        title="Inbox Pengaduan"
        titleSuffix={`(${meta.total})`}
        description="Kelola aduan bantuan pelanggan dan hubungi langsung via WhatsApp."
      />
      <DataTable
        searchKey="title"
        columns={Columns}
        data={messages}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari nama, email, subjek..."
        customFilters={
          <div className="flex w-full gap-2 sm:w-auto">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'ALL')}>
            <SelectTrigger className="w-full sm:w-50">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="PROCESS">Proses</SelectItem>
                <SelectItem value="RESOLVED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        variant="eventkan"
      />
    </section>
  );
};

export default SupportMessagesPage;
