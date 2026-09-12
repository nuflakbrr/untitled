import 'moment/locale/id';

import type { FC } from 'react';

import moment from 'moment';
import Link from 'next/link';
import { MapPin, ArrowRight, CalendarDays } from 'lucide-react';

import type { Event } from '@/interfaces/features/events';
import type { EventCategory } from '@/interfaces/features/event-categories';

import { formatCurrency } from '@/lib/formatCurrency';

import CategoryLinks from './CategoryLinks';
import { getCoverStyles } from '../_libs/getCoverStyles';

type Props = { events: Event[]; categories: EventCategory[] };

const FeaturedEvents: FC<Props> = ({ events, categories }) => {
  const visibleEvents = events.slice(0, 3);
  const coverStylesByEvent = getCoverStyles(visibleEvents.map((event) => event.id));

  return (
    <section id="event" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-295">
        <div className="mb-12">
          <h2 className="font-display max-w-190 text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-.04em]">
            Temukan pengalaman yang layak kamu datangi.
          </h2>
          <div className="mt-6 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-[17px] text-[#6c7280]">
              Seminar, workshop, kompetisi, sampai festival kampus. Semua event tersaji dalam satu
              tempat dengan proses registrasi yang lebih ringkas.
            </p>
            <Link
              href="/events"
              className="inline-flex group shrink-0 items-center gap-2 rounded-full border border-[#11233f] px-4.5 py-3 font-bold text-[#11233f] transition hover:-translate-y-0.5 hover:bg-[#11233f] hover:text-white"
            >
              Lihat semua event{' '}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
            </Link>
          </div>
        </div>

        <CategoryLinks categories={categories} />

        {visibleEvents.length === 0 ? (
          <div className="rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] p-12 text-center text-[#6c7280]">
            Belum ada event yang tersedia.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event, index) => {
              const slotsLeft = Math.max(0, event.quota - event.registrationCount);
              const isFull = slotsLeft === 0;
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(17,35,63,.08)]"
                >
                  <div
                    className={`relative flex aspect-[1.35] flex-col justify-between overflow-hidden p-5.5 ${coverStylesByEvent[index]}`}
                  >
                    <span className="text-xs font-extrabold uppercase tracking-[.08em]">
                      {event.category?.name ?? 'Event'}
                    </span>
                    <h3 className="font-display relative z-10 max-w-65 text-[34px] font-extrabold leading-[.97] tracking-[-.045em]">
                      {event.title}
                    </h3>
                    {isFull && (
                      <span className="absolute right-4 top-4 rounded-full bg-[#11233f]/80 px-3 py-1 text-xs font-bold text-white">
                        Kuota penuh
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-[19px] font-bold tracking-[-.02em]">
                      {event.title}
                    </h3>
                    <div className="mt-3 grid gap-2 text-[13px] text-[#6c7280]">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#ff7a45]" />
                        {moment(event.startDate).locale('id').format('DD MMMM YYYY')}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#ff7a45]" />
                        {event.location}
                      </span>
                    </div>
                    <div className="mt-4.5 flex items-center justify-between border-t border-[#111927]/10 pt-4">
                      <strong className="text-[#11233f]">
                        {event.price ? formatCurrency(event.price) : 'Gratis'}
                      </strong>
                      <span className="grid h-9.5 w-9.5 place-items-center rounded-full bg-[#11233f] text-white transition group-hover:-rotate-45">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
