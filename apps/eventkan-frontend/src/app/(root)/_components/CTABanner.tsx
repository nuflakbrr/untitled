import type { FC } from 'react';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CTABanner: FC = () => (
  <section className="px-4 pb-24 pt-8 sm:px-6">
    <div className="relative mx-auto max-w-295 overflow-hidden rounded-[34px] bg-[#ff7a45] px-7 py-18 text-white sm:px-18 before:absolute before:-right-27.5 before:-top-30 before:h-95 before:w-95 before:rounded-full before:border-76 before:border-white/12">
      <h2
        className="relative z-10 max-w-195 text-[clamp(38px,6vw,70px)] font-extrabold leading-[.98] tracking-[-.055em]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Siap menemukan event yang paling cocok untukmu?
      </h2>
      <p className="relative z-10 mt-5 max-w-137.5 text-white/84">
        Jelajahi seminar, workshop, kompetisi, dan berbagai kegiatan kampus dalam satu tempat.
        Daftar lebih mudah, dapatkan tiket digital, lalu datang dan nikmati pengalaman terbaikmu.
      </p>
      <Link
        href="/events"
        className="group relative z-10 mt-7 inline-flex items-center gap-2 rounded-full border border-white bg-white px-4.5 py-3 font-bold text-[#11233f] transition hover:-translate-y-0.5 hover:bg-white"
      >
        Temukan event pilihanmu{' '}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
      </Link>
    </div>
  </section>
);

export default CTABanner;
