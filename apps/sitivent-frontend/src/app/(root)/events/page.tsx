import 'moment-timezone';
import 'moment/locale/id';

import type { Metadata } from 'next';

import api from '@/lib/api';
import moment from 'moment';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Empty, EmptyTitle, EmptyHeader, EmptyDescription } from '@/components/ui/empty';

import EventCard from './_components/EventCard';
import SearchBanner from './_components/SearchBanner';

type Props = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export const metadata: Metadata = {
  title: 'Jelajahi Event - SITIVENT',
  description:
    'Temukan seminar, workshop, webinar, dan bootcamp terbaik untuk meningkatkan keahlian Anda.',
};

export default async function EventsPage({ searchParams }: Props) {
  const { q, category } = await searchParams;

  let events: Array<Record<string, any>> = [];
  try {
    events = (await api.get('/features/v1/events', { params: { search: q, category_slug: category, status: 'PUBLISHED', page: 1, limit: 100 } })).data.data ?? [];
  } catch { /* empty state */ }

  return (
    <section
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
      style={{ background: '#FAF9F5' }}
    >
      {/* SOLID: Extracted Header/Hero Banner component */}
      <Suspense
        fallback={
          <div style={{ background: '#141413' }} className="py-28 px-6 text-center">
            <div className="animate-pulse space-y-4 max-w-md mx-auto">
              <div className="h-4 bg-zinc-800 rounded w-1/4 mx-auto" />
              <div className="h-8 bg-zinc-800 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-zinc-800 rounded w-full mx-auto" />
            </div>
          </div>
        }
      >
        <SearchBanner />
      </Suspense>

      {/* Main Listing Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {events.length === 0 ? (
          <Empty
            className="py-24 border rounded-2xl bg-white dark:bg-zinc-900 shadow-xs"
            style={{ borderColor: '#E3DACC' }}
          >
            <EmptyHeader>
              <EmptyTitle>Event Tidak Ditemukan</EmptyTitle>
              <EmptyDescription>
                {q
                  ? `Tidak ada event aktif yang cocok dengan kata kunci "${q}".`
                  : 'Saat ini belum ada event aktif yang tersedia.'}
              </EmptyDescription>
            </EmptyHeader>
            {q && (
              <Button asChild className="mt-4 text-white" style={{ background: '#D97757' }}>
                <Link href="/events">Lihat Semua Event</Link>
              </Button>
            )}
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => {
              const formattedStartDate = moment(event.startDate)
                .tz('Asia/Jakarta')
                .locale('id')
                .format('DD MMMM YYYY');

              return (
                /* SOLID: Extracted Single Event Card component */
                <EventCard key={event.id} event={event as never} formattedStartDate={formattedStartDate} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
