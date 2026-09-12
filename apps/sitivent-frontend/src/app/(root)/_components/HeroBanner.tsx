'use client';

import 'moment-timezone';

import type { FC } from 'react';
import type { Route } from 'next';

import moment from 'moment';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

import type { Event } from '@/interfaces/features/events';

const eventCategories = [
  'Seminar',
  'Workshop',
  'Kompetisi',
  'Webinar',
  'Talkshow',
  'Festival Kampus',
  'Career Event',
];

type Props = { events: Event[] };

const HeroBanner: FC<Props> = ({ events }) => {
  const event = events[0];
  const eventTitle = event?.title ?? "Future Creators Summit '26";

  return (
    <>
      <section className="overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
        <div className="mx-auto grid max-w-295 items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            {/* <span className="inline-flex items-center gap-2 rounded-full border border-[#111927]/10 bg-white/55 px-3 py-2 text-[13px] font-bold text-[#11233f] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#ff7a45] shadow-[0_0_0_5px_rgba(255,122,69,.14)]" />
              Event kampus, tanpa ribet administratif
            </span> */}
            <h1 className="font-display mt-5 max-w-187.5 text-[clamp(48px,7vw,88px)] font-extrabold leading-[.97] tracking-[-.065em]">
              Datang. Terhubung.{' '}
              <span className="inline-block -rotate-2 text-[#ff7a45]">Berpengalaman.</span>
            </h1>
            <p className="mt-6 max-w-155 text-lg leading-relaxed text-[#6c7280]">
              Jangan sampai ketinggalan event kampus yang paling seru dan relevan buatmu. Temukan
              acaranya, daftar dengan cepat, simpan tiket digital, check-in tanpa antre, dan bawa
              pulang pengalaman berharga plus sertifikat.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 rounded-full bg-[#11233f] px-4.5 py-3 font-bold text-white shadow-[0_10px_22px_rgba(17,35,63,.16)] transition hover:-translate-y-0.5"
              >
                Jelajahi Event
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
              </Link>
              <Link
                href={'#fitur' as Route}
                className="inline-flex items-center gap-2 rounded-full border border-[#11233f] px-4.5 py-3 font-bold text-[#11233f] transition hover:-translate-y-0.5"
              >
                Lihat cara kerjanya
              </Link>
            </div>
          </div>

          <div
            className="relative min-h-136 overflow-visible sm:min-h-135"
            aria-label="Preview tiket event Sitivent"
          >
            <article className="absolute inset-[18px_10px_126px_10px] rotate-0 overflow-hidden rounded-3xl bg-[#11233f] p-4 text-white shadow-[0_12px_30px_rgba(17,35,63,.1)] sm:inset-[28px_34px_56px_22px] sm:rotate-2 sm:p-5.5 sm:shadow-[0_18px_50px_rgba(17,35,63,.08)]">
              <div className="relative flex h-60 flex-col justify-between overflow-hidden rounded-[20px] bg-[#1b3458] bg-[linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.13)),repeating-linear-gradient(125deg,transparent_0_44px,rgba(255,255,255,.035)_45px_46px)] p-4 after:absolute after:-bottom-10 after:-right-8 after:h-45 after:w-45 after:rounded-full after:bg-[#ff7a45] before:absolute before:bottom-6 before:right-28 before:h-27.5 before:w-27.5 before:rounded-full before:bg-[#f7df86] before:opacity-80 sm:h-70 sm:rounded-[22px] sm:p-6">
                <span className="relative z-10 w-fit rounded-full border border-white/15 bg-white/15 px-3 py-2 text-xs backdrop-blur">
                  OPEN REGISTRATION
                </span>
                <h2 className="font-display relative z-10 max-w-60 text-[clamp(26px,8vw,42px)] font-bold leading-[.98] tracking-tighter sm:max-w-82.5 sm:text-[clamp(28px,3.5vw,42px)]">
                  {eventTitle}
                </h2>
              </div>
              <div className="px-1 pb-1 pt-4 sm:pt-5.5">
                <div className="flex items-start justify-between gap-3 sm:gap-5">
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-base font-bold leading-snug sm:text-lg">
                      {event?.title ?? 'Future Creators Summit'}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[11px] text-white/65 sm:text-[13px]">
                      {event
                        ? `${moment(event.startDate).tz('Asia/Jakarta').locale('id').format('DD MMMM YYYY')} · ${event.location}`
                        : '12 September 2026 · Auditorium Kampus'}
                    </p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-[#11233f] sm:px-3 sm:py-2 sm:text-xs">
                    {event?.price ? 'Berbayar' : 'Gratis'}
                  </span>
                </div>
              </div>
            </article>
            <aside className="absolute right-0 bottom-2 w-44 -rotate-3 rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] p-3.5 text-[#111927] shadow-[0_12px_30px_rgba(17,35,63,.1)] sm:-right-1.5 sm:bottom-2.5 sm:w-57.5 sm:-rotate-7 sm:p-4.5 sm:shadow-[0_18px_50px_rgba(17,35,63,.08)]">
              <div className="flex items-center justify-between gap-3">
                <strong className="font-display text-[15px]">E-Ticket</strong>
                <span>●</span>
              </div>
              <div className="mt-4 h-18.5 rounded-xl bg-[repeating-linear-gradient(90deg,#11233f_0_3px,transparent_3px_7px,#11233f_7px_9px,transparent_9px_12px)]" />
              <div className="mt-3 flex justify-between text-[11px] text-[#6c7280]">
                <span>SIT-260912</span>
                <span>GENERAL</span>
              </div>
            </aside>
            <aside className="absolute bottom-20 left-1 w-40 rotate-2 rounded-[22px] border border-[#111927]/8 bg-[#bfe4c7] px-3.5 py-3 text-[#111927] shadow-[0_12px_30px_rgba(17,35,63,.1)] sm:bottom-17.5 sm:-left-4.5 sm:w-47.5 sm:rotate-[5deg] sm:px-4.5 sm:py-4 sm:shadow-[0_18px_50px_rgba(17,35,63,.08)]">
              <strong className="font-display block text-sm sm:text-[15px]">
                <Check className="mr-1 inline h-4 w-4" />
                Check-in berhasil
              </strong>
              <span className="text-[11px] text-[#46604c] sm:text-xs">
                Kehadiran tercatat otomatis
              </span>
            </aside>
          </div>
        </div>
      </section>
      <div className="overflow-hidden border-y border-[#111927]/10 bg-white/40">
        <div className="category-marquee">
          {[0, 1, 2, 3].map((group) => (
            <div
              key={group}
              aria-hidden={group === 1}
              className="category-marquee__group font-display"
            >
              {eventCategories.map((item) => (
                <span key={`${group}-${item}`} className="category-marquee__item">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroBanner;
