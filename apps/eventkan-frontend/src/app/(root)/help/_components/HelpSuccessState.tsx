import type { FC } from 'react';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import type { HelpSuccessStateProps } from '@/interfaces/features/support';

const HelpSuccessState: FC<HelpSuccessStateProps> = ({ onReset }) => (
  <div className="rounded-[28px] border border-eventkan-ink/10 bg-eventkan-surface p-8 text-center shadow-[0_18px_50px_rgba(17,35,63,.06)] sm:p-12">
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-eventkan-green text-eventkan-green-ink">
      <CheckCircle2 className="h-9 w-9" />
    </div>
    <h2 className="font-display mt-6 text-2xl font-extrabold tracking-[-.04em] text-eventkan-navy">
      Laporan terkirim
    </h2>
    <p className="mx-auto mt-3 max-w-105 text-sm leading-relaxed text-eventkan-muted">
      Terima kasih sudah menghubungi kami. Tim EVENTKAN akan meninjau laporanmu dan menghubungi
      kembali jika diperlukan.
    </p>
    <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
      <button
        type="button"
        onClick={onReset}
        className="cursor-pointer rounded-full bg-eventkan-navy px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-eventkan-navy-hover"
      >
        Kirim laporan lain
      </button>
      <Link
        href="/"
        className="rounded-full border border-eventkan-navy px-5 py-3 text-sm font-bold text-eventkan-navy transition hover:bg-eventkan-navy hover:text-white"
      >
        Ke beranda
      </Link>
    </div>
  </div>
);

export default HelpSuccessState;
