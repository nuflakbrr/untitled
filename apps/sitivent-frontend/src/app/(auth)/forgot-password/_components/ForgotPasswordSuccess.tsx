import type { FC } from 'react';

import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface ForgotPasswordSuccessProps {
  email: string;
  onRetry: () => void;
}

const ForgotPasswordSuccess: FC<ForgotPasswordSuccessProps> = ({ email, onRetry }) => (
  <div className="text-center">
    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#ffe5d8] text-[#ff7a45]">
      <CheckCircle className="h-7 w-7" />
    </div>
    <h3 className="font-display mt-5 text-xl font-extrabold text-[#11233f]">Email terkirim</h3>
    <p className="mt-3 text-sm leading-relaxed text-[#6c7280]">
      Tautan reset password sudah dikirim ke{' '}
      <span className="font-semibold text-[#11233f]">{email}</span>. Periksa kotak masuk atau folder
      spam kamu.
    </p>
    <p className="mt-4 text-xs text-[#6c7280]">
      Belum menerima email?{' '}
      <button
        type="button"
        onClick={onRetry}
        className="font-bold text-[#11233f] transition hover:text-[#ff7a45]"
      >
        Kirim ulang
      </button>
    </p>
    <Link
      href="/login"
      className="mt-6 inline-flex group items-center gap-2 text-sm font-bold text-[#11233f] transition hover:text-[#ff7a45]"
    >
      Kembali ke login{' '}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
    </Link>
  </div>
);

export default ForgotPasswordSuccess;
