import type { FC } from 'react';

import Link from 'next/link';
import { MapPin, ArrowRight, CalendarDays } from 'lucide-react';

import type { Event } from '@/interfaces/features/events';

import { formatCurrency } from '@/lib/formatCurrency';

interface EventCardProps {
  event: Event;
  formattedStartDate: string;
  coverStyle: string;
}

const EventCard: FC<EventCardProps> = ({ event, formattedStartDate, coverStyle }) => {
  const slotsLeft = Math.max(0, event.quota - event.registrationCount);
  const isClosed = event.status !== 'PUBLISHED';
  const isFull = !isClosed && slotsLeft === 0;
  const isLimited = !isClosed && !isFull && slotsLeft < 30;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(17,35,63,.08)]"
    >
      <div
        className={`relative flex aspect-[1.45] flex-col justify-between overflow-hidden p-5.5 ${coverStyle}`}
      >
        <span className="relative z-10 text-xs font-extrabold uppercase tracking-[.08em]">
          {event.eventType === 'ONLINE' ? 'Online' : 'Offline'} · {event.category?.name ?? 'Event'}
        </span>
        <h2 className="font-display relative z-10 max-w-65 text-[32px] font-extrabold leading-[.98] tracking-[-.045em]">
          {event.title}
        </h2>
      </div>

      <div className="p-5.5">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1.5 text-[11px] font-extrabold ${
            isClosed
              ? 'bg-[#f0ece7] text-[#756a61]'
              : isFull
                ? 'bg-[#ffe5d8] text-[#a94e29]'
              : isLimited
                ? 'bg-[#ffe5d8] text-[#a94e29]'
                : 'bg-[#e6f3e9] text-[#36784b]'
          }`}
        >
          {isClosed
            ? 'Pendaftaran ditutup'
            : isFull
              ? 'Kuota penuh'
            : isLimited
              ? `${slotsLeft} kursi tersisa`
              : 'Pendaftaran dibuka'}
        </span>

        <h3 className="font-display mt-3 line-clamp-2 text-xl font-bold leading-tight tracking-tight text-[#11233f]">
          {event.title}
        </h3>
        <div className="mt-3 grid gap-2 text-[13px] text-[#6c7280]">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#ff7a45]" />
            {formattedStartDate} · {event.startTime} WIB
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#ff7a45]" />
            <span className="line-clamp-1">{event.location}</span>
          </span>
        </div>

        <div className="mt-4.5 flex items-center justify-between border-t border-[#111927]/10 pt-4">
          <strong className="text-[#11233f]">
            {event.price ? formatCurrency(event.price) : 'Gratis'}
          </strong>
          <span className="grid h-9.5 w-9.5 place-items-center rounded-full bg-[#11233f] text-white transition duration-200 group-hover:-rotate-45">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
