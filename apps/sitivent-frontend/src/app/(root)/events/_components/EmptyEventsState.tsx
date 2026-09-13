import type { FC } from 'react';

import Link from 'next/link';

interface EmptyEventsStateProps {
  query?: string;
}

const EmptyEventsState: FC<EmptyEventsStateProps> = ({ query }) => (
  <div className="rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] px-6 py-24 text-center shadow-[0_18px_50px_rgba(17,35,63,.05)]">
    <h2 className="font-display text-2xl font-extrabold text-[#11233f]">Event tidak ditemukan</h2>
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

export default EmptyEventsState;
