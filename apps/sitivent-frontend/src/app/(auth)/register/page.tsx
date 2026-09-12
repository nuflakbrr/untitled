import type { Metadata } from 'next';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';

import RegisterForm from './_components/RegisterForm';

export const metadata: Metadata = genPageMetadata({
  title: 'Daftar Akun',
  description: 'Buat akun Sitivent gratis dan mulai temukan event terbaik untukmu.',
});

const Register = () => (
  <main className="min-h-dvh bg-[#f6f3eb] p-3 sm:p-5 lg:p-5.5">
    <div className="mx-auto grid min-h-[calc(100dvh-44px)] max-w-310 overflow-hidden rounded-[30px] lg:grid-cols-2">
      <section className="relative flex min-h-100 flex-col justify-between overflow-hidden rounded-[30px] bg-[#11233f] p-7 text-white sm:p-10 lg:min-h-0 lg:p-11">
        <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border-58 border-white/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#ff7a45]/20 blur-3xl" />

        <Link
          href="/"
          className="relative z-10 inline-flex w-fit items-center gap-2"
          aria-label="Beranda Sitivent"
        >
          <span className="font-display grid h-9 w-9 -rotate-3 place-items-center rounded-[12px] bg-white text-lg font-extrabold text-[#11233f]">
            S
          </span>
          <span className="font-display text-xl font-extrabold tracking-[-.04em]">Sitivent</span>
        </Link>

        <div className="relative z-10 mt-16 lg:mt-0">
          <h1 className="font-display max-w-150 text-[clamp(44px,6vw,74px)] font-extrabold leading-[.97] tracking-[-.06em]">
            Temukan event yang bikin kamu berkembang.
          </h1>
          <p className="mt-5 max-w-120 text-base leading-relaxed text-white/68 sm:text-lg">
            Pilih seminar, workshop, atau kompetisi yang sesuai minatmu. Daftar tanpa ribet, simpan
            tiket digital, dan akses seluruh detail event dari satu akun.
          </p>
        </div>

        <p className="relative z-10 mt-12 text-xs text-white/50 lg:mt-0">
          Temukan event. Datang dengan siap. Bawa pulang pengalaman.
        </p>
      </section>

      <section className="grid place-items-center bg-[#f6f3eb] px-5 py-10 sm:px-10 lg:px-16 lg:py-12">
        <div className="w-full max-w-115">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6c7280] transition hover:text-[#11233f]"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke beranda
          </Link>
          <div className="mt-8">
            <h2 className="font-display text-[clamp(34px,4vw,44px)] font-extrabold leading-none tracking-[-.045em] text-[#11233f]">
              Buat akun Sitivent
            </h2>
            <p className="mt-3 text-[#6c7280]">Gratis untuk peserta.</p>
          </div>

          <div className="mt-8 rounded-[26px] border border-[#111927]/10 bg-[#fffdf8] p-6 shadow-[0_18px_50px_rgba(17,35,63,.06)] sm:p-8">
            <RegisterForm />
          </div>

          <p className="mt-6 whitespace-nowrap text-center text-[11px] leading-relaxed tracking-tight text-[#6c7280] sm:text-xs">
            Dengan mendaftar, kamu menyetujui{' '}
            <Link href="/terms" className="font-semibold text-[#11233f] hover:text-[#ff7a45]">
              Syarat &amp; Ketentuan
            </Link>{' '}
            dan{' '}
            <Link href="/privacy" className="font-semibold text-[#11233f] hover:text-[#ff7a45]">
              Kebijakan Privasi
            </Link>{' '}
            kami.
          </p>
        </div>
      </section>
    </div>
  </main>
);

export default Register;
