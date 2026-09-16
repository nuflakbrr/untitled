import type { FC } from 'react';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

const ResetPasswordSuccess: FC = () => (
  <div className="rounded-[20px] bg-eventkan-green p-6 text-center sm:p-7">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/55 text-eventkan-green-ink">
      <CheckCircle className="h-7 w-7" />
    </div>
    <h3 className="font-display mt-5 text-2xl font-extrabold text-eventkan-navy">
      Password berhasil diperbarui.
    </h3>
    <p className="mt-3 text-sm leading-relaxed text-eventkan-navy/70">
      Kamu sekarang bisa masuk menggunakan password baru.
    </p>
    <Link
      href="/login"
      className="mt-6 inline-flex group items-center gap-2 rounded-full bg-eventkan-navy px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-eventkan-navy-hover"
    >
      Masuk ke EVENTKAN
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
    </Link>
  </div>
);

export default ResetPasswordSuccess;
