'use client';

import { type FC } from 'react';

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
import { useTestimoniesList } from './_hooks/useTestimoniesList';

const TestimoniesCMS: FC = () => {
  const { testimonies, meta, events, eventId, setPage, setLimit, setEventId, search, isLoading, handleSearchChange } = useTestimoniesList();

  return (
    <section className="mx-auto w-full max-w-375">
      <Heading
        variant="soft"
        title="Ulasan & Testimoni"
        titleSuffix={`(${meta.total})`}
        description="Kelola dan pantau ulasan serta testimoni yang diberikan oleh peserta event."
      />
      <DataTable
        searchKey="comment"
        columns={Columns}
        data={testimonies}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari ulasan, nama peserta, atau event..."
        customFilters={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select
              value={eventId || ''}
              onValueChange={(value) => {
                setEventId(value || undefined);
              }}
            >
              <SelectTrigger className="w-full sm:w-50">
                <SelectValue placeholder="Semua Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Event</SelectItem>
                {events.map((event: { id: string; title: string }) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        variant="eventkan"
      />
    </section>
  );
};

export default TestimoniesCMS;
