import { Suspense } from 'react';

import type { EventsPageProps } from '@/interfaces/features/events';

import { genPageMetadata } from '@/app/seo';
import { getPublicEvents } from '@/services/public/events';
import { getPublicEventCategories } from '@/services/public/event-categories';

import SearchBanner from './_components/EventSearch';
import EventsResults from './_components/EventsResults';

export const metadata = genPageMetadata({
  title: 'Jelajahi Event',
  description:
    'Temukan seminar, workshop, webinar, dan bootcamp terbaik untuk meningkatkan keahlian Anda.',
});

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { q, category } = await searchParams;
  const [events, categories] = await Promise.all([
    getPublicEvents(q, category),
    getPublicEventCategories(),
  ]);

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
        <SearchBanner categories={categories} />
      </Suspense>

      <div className="mx-auto max-w-295 px-4 pb-16 sm:px-6 sm:pb-24">
        <EventsResults events={events} query={q} />
      </div>
    </section>
  );
}
