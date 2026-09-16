import type { Metadata } from 'next';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';

import LoginForm from './_components/LoginForm';

export const metadata: Metadata = genPageMetadata({
  title: 'Masuk',
  description: 'Masuk ke EVENTKAN untuk mengelola dan mengikuti event impianmu.',
});

const Login = () => (
  <main className="min-h-dvh bg-eventkan-canvas p-3 sm:p-5 lg:p-5.5">
    <div className="mx-auto grid min-h-[calc(100dvh-44px)] max-w-310 overflow-hidden rounded-[30px] lg:grid-cols-2">
      <section className="relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[30px] bg-eventkan-navy p-7 text-white sm:p-10 lg:min-h-0 lg:p-11">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border-58 border-white/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-eventkan-accent/20 blur-3xl" />

        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-2"
          aria-label="Beranda EVENTKAN"
        >
          <span className="font-display grid h-9 w-9 -rotate-3 place-items-center rounded-[12px] bg-white text-lg font-extrabold text-eventkan-navy">
            S
          </span>
          <span className="font-display text-xl font-extrabold tracking-[-.04em]">EVENTKAN</span>
        </Link>

        <div className="relative z-10 mt-16 lg:mt-0">
          <h1 className="font-display max-w-150 text-[clamp(44px,6vw,74px)] font-extrabold leading-[.97] tracking-[-.06em]">
            Selamat datang kembali.
          </h1>
          <p className="mt-5 max-w-120 text-base leading-relaxed text-white/68 sm:text-lg">
            Masuk untuk melihat tiket, status registrasi, dan sertifikatmu.
          </p>
        </div>

        <p className="relative z-10 mt-12 text-xs text-white/50 lg:mt-0">
          Temukan event, Datang ke venue, Bawa pulang pengalaman.
        </p>
      </section>

      <section className="grid place-items-center bg-eventkan-canvas px-5 py-10 sm:px-10 lg:px-16 lg:py-12">
        <div className="w-full max-w-115">
          <Link
            href="/"
            className="inline-flex group items-center gap-2 text-sm text-eventkan-muted transition hover:text-eventkan-navy"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />{' '}
            Kembali ke beranda
          </Link>

          <div className="mt-8">
            <h2 className="font-display text-[clamp(34px,4vw,44px)] font-extrabold leading-none tracking-[-.045em] text-eventkan-navy">
              Masuk ke EVENTKAN
            </h2>
            <p className="mt-3 text-eventkan-muted">Gunakan akunmu untuk melanjutkan.</p>
          </div>

          <div className="mt-8 rounded-[26px] border border-eventkan-ink/10 bg-eventkan-surface p-6 shadow-[0_18px_50px_rgba(17,35,63,.06)] sm:p-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default Login;
