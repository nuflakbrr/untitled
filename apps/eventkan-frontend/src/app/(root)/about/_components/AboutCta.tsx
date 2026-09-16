import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const AboutCta = () => (
  <section className="px-4 pb-20 sm:px-6 sm:pb-24">
    <div className="relative mx-auto flex max-w-295 flex-col items-start justify-between gap-7 overflow-hidden rounded-[30px] bg-eventkan-accent p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:p-12">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border-32 border-white/15" />
      <div className="pointer-events-none absolute -bottom-24 right-32 h-44 w-44 rounded-full bg-eventkan-yellow/25" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-72 -rotate-12 bg-white/20" />
      <div className="relative z-10">
        <h2 className="font-display max-w-190 text-[clamp(36px,5vw,58px)] font-extrabold leading-none tracking-tighter">
          Lebih sedikit administrasi. Lebih banyak pengalaman.
        </h2>
        <p className="mt-3 max-w-145 text-base leading-relaxed text-white/80">
          Temukan event dengan EVENTKAN untuk membuat perjalanan acara terasa lebih sederhana.
        </p>
      </div>
      <Link
        href="/events"
        className="relative z-10 inline-flex shrink-0 group items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-eventkan-navy transition hover:-translate-y-0.5"
      >
        Jelajahi Event{' '}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
      </Link>
    </div>
  </section>
);
