import 'moment-timezone';
import 'moment/locale/id';

import type { FC } from 'react';

import moment from 'moment';
import Link from 'next/link';

import type { EventsResultsProps } from '@/interfaces/features/events';

import { Button } from '@/components/ui/button';
import { Empty, EmptyTitle, EmptyHeader, EmptyDescription } from '@/components/ui/empty';

import EventCard from './EventCard';

const EventsResults: FC<EventsResultsProps> = ({ events, query }) => {
  if (events.length === 0) {
    return (
      <Empty className="border border-[#111927]/10 bg-[#fffdf8] py-24 shadow-[0_18px_50px_rgba(17,35,63,.05)]">
        <EmptyHeader>
          <EmptyTitle>Event Tidak Ditemukan</EmptyTitle>
          <EmptyDescription>
            {query
              ? `Tidak ada event aktif yang cocok dengan kata kunci "${query}".`
              : 'Saat ini belum ada event aktif yang tersedia.'}
          </EmptyDescription>
        </EmptyHeader>
        {query && (
          <Button asChild className="mt-4 bg-[#11233f] text-white hover:bg-[#1b3458]">
            <Link href="/events">Lihat Semua Event</Link>
          </Button>
        )}
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {events.map((event) => {
        const formattedStartDate = moment(event.startDate)
          .tz('Asia/Jakarta')
          .locale('id')
          .format('DD MMMM YYYY');

        return <EventCard key={event.id} event={event} formattedStartDate={formattedStartDate} />;
      })}
    </div>
  );
};

export default EventsResults;
