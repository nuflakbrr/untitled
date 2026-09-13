import type { FC } from 'react';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

import type { ForgotPasswordSuccessProps } from '@/interfaces/features/auth';

const ForgotPasswordSuccess: FC<ForgotPasswordSuccessProps> = ({ email, onRetry }) => (
  <div className="rounded-[20px] bg-[#bfe4c7] p-6 text-left sm:p-7">
    <div className="flex items-center gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/55 text-[#36784b]">
        <CheckCircle className="h-6 w-6" />
      </div>
      <h3 className="font-display text-2xl font-extrabold leading-none text-[#11233f]">
        Cek email kamu.
      </h3>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-[#11233f]/70">
      Jika email tersebut terhubung ke akun SITIVENT, kami akan mengirim tautan reset password.
    </p>
    <div className="mt-4 wrap-break-word rounded-[12px] bg-white/42 px-3 py-2.5 text-xs font-bold text-[#11233f]">
      {email}
    </div>
    <p className="mt-4 text-xs text-[#6c7280]">
      Belum menerima email?{' '}
      <button
        type="button"
        onClick={onRetry}
        className="cursor-pointer font-bold text-[#11233f] transition hover:text-[#ff7a45]"
      >
        Kirim ulang
      </button>
    </p>
    <Link
      href="/login"
      className="mt-6 inline-flex group items-center gap-2 rounded-full bg-[#11233f] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458]"
    >
      Kembali ke login{' '}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
    </Link>
  </div>
);

export default ForgotPasswordSuccess;
