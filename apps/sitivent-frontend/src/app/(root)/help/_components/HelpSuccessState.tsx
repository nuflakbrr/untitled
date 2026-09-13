import type { FC } from 'react';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import type { HelpSuccessStateProps } from '@/interfaces/features/support';

const HelpSuccessState: FC<HelpSuccessStateProps> = ({ onReset }) => (
  <div className="rounded-[28px] border border-[#111927]/10 bg-[#fffdf8] p-8 text-center shadow-[0_18px_50px_rgba(17,35,63,.06)] sm:p-12">
    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#bfe4c7] text-[#36784b]">
      <CheckCircle2 className="h-9 w-9" />
    </div>
    <h2 className="font-display mt-6 text-2xl font-extrabold tracking-[-.04em] text-[#11233f]">
      Laporan terkirim
    </h2>
    <p className="mx-auto mt-3 max-w-105 text-sm leading-relaxed text-[#6c7280]">
      Terima kasih sudah menghubungi kami. Tim SITIVENT akan meninjau laporanmu dan menghubungi
      kembali jika diperlukan.
    </p>
    <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
      <button
        type="button"
        onClick={onReset}
        className="cursor-pointer rounded-full bg-[#11233f] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458]"
      >
        Kirim laporan lain
      </button>
      <Link
        href="/"
        className="rounded-full border border-[#11233f] px-5 py-3 text-sm font-bold text-[#11233f] transition hover:bg-[#11233f] hover:text-white"
      >
        Ke beranda
      </Link>
    </div>
  </div>
);

export default HelpSuccessState;
