import type { Metadata } from 'next';

import { Suspense } from 'react';

import { getPublicEvents } from '@/services/admin/events';

import SearchBanner from './_components/SearchBanner';
import EventsResults from './_components/EventsResults';

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
  const events = await getPublicEvents(q, category);

  return (
    <section className="min-h-screen bg-[#f6f3eb] pb-16">
      <Suspense
        fallback={
          <div className="bg-[#11233f] px-6 py-28 text-center">
            <div className="mx-auto max-w-md animate-pulse space-y-4">
              <div className="mx-auto h-4 w-1/4 rounded bg-white/10" />
              <div className="mx-auto h-8 w-3/4 rounded bg-white/10" />
              <div className="mx-auto h-4 w-full rounded bg-white/10" />
            </div>
          </div>
        }
      >
        <SearchBanner />
      </Suspense>

      <div className="mx-auto mt-12 max-w-295 px-4">
        <EventsResults events={events} query={q} />
      </div>
    </section>
  );
}
