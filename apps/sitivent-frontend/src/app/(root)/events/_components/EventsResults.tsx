import 'moment-timezone';
import 'moment/locale/id';

import type { FC } from 'react';

import moment from 'moment';
import Link from 'next/link';

import type { EventsResultsProps } from '@/interfaces/features/events';

import EventCard from './EventCard';
import { getCoverStyles } from '../../_libs/getCoverStyles';

const EventsResults: FC<EventsResultsProps> = ({ events, query }) => {
  if (events.length === 0) {
    return (
      <div className="rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] px-6 py-24 text-center shadow-[0_18px_50px_rgba(17,35,63,.05)]">
        <h2 className="font-display text-2xl font-extrabold text-[#11233f]">
          Event tidak ditemukan
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6c7280]">
            {query
              ? `Tidak ada event aktif yang cocok dengan kata kunci "${query}".`
              : 'Saat ini belum ada event aktif yang tersedia.'}
        </p>
        {query && (
          <Link
            href="/events"
            className="mt-5 inline-flex rounded-full bg-[#11233f] px-4.5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458]"
          >
            Lihat semua event
          </Link>
        )}
      </div>
    );
  }

  const coverStyles = getCoverStyles(events.map((event) => event.id));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {events.map((event, index) => {
        const formattedStartDate = moment(event.startDate)
          .tz('Asia/Jakarta')
          .locale('id')
          .format('DD MMMM YYYY');

        return (
          <EventCard
            key={event.id}
            event={event}
            formattedStartDate={formattedStartDate}
            coverStyle={coverStyles[index]}
          />
        );
      })}
    </div>
  );
};

export default EventsResults;
