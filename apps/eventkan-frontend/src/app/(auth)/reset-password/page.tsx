import type { Metadata } from 'next';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';

import ResetPasswordForm from './_components/ResetPasswordForm';

export const metadata: Metadata = genPageMetadata({
  title: 'Reset Password',
  description: 'Buat password baru untuk akun EVENTKAN Anda.',
});

const ResetPassword = () => (
  <main className="min-h-dvh bg-eventkan-canvas p-3 sm:p-5 lg:p-5.5">
    <div className="mx-auto grid min-h-[calc(100dvh-44px)] max-w-310 gap-0 lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative flex min-h-100 flex-col justify-between overflow-hidden rounded-[30px] bg-eventkan-navy p-7 text-white sm:p-10 lg:min-h-[calc(100dvh-44px)] lg:p-11">
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-eventkan-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-14%] top-[12%] h-72 w-72 rounded-full bg-eventkan-accent/90" />
        <div className="pointer-events-none absolute right-[10%] top-[21%] h-28 w-28 rounded-full bg-eventkan-yellow" />
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_42px,rgba(255,255,255,.025)_43px_44px)]" />

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
            Buat password baru.
          </h1>
          <p className="mt-5 max-w-120 text-base leading-relaxed text-white/68 sm:text-lg">
            Password baru akan dipakai untuk masuk kembali dan mengakses tiket, registrasi, serta
            sertifikatmu.
          </p>
        </div>

        <p className="relative z-10 mt-12 text-xs text-white/50 lg:mt-0">
          Temukan event, Datang ke venue, Bawa pulang pengalaman.
        </p>
      </section>

      <section className="grid place-items-center bg-eventkan-canvas px-5 py-10 sm:px-10 lg:px-12 lg:py-12">
        <div className="w-full max-w-117.5">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-sm text-eventkan-muted transition hover:text-eventkan-navy"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Kembali ke halaman masuk
          </Link>

          <div className="mt-8">
            <h2 className="font-display text-[clamp(34px,4vw,46px)] font-extrabold leading-none tracking-[-.045em] text-eventkan-navy">
              Reset password
            </h2>
            <p className="mt-3 text-eventkan-muted">
              Masukkan password baru yang belum pernah kamu gunakan sebelumnya.
            </p>
          </div>

          <div className="mt-8 rounded-[26px] border border-eventkan-ink/10 bg-eventkan-surface p-6 shadow-[0_18px_50px_rgba(17,35,63,.06)] sm:p-8">
            <ResetPasswordForm />
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default ResetPassword;
