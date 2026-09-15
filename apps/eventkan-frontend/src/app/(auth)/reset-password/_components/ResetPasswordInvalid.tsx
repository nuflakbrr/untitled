import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const ResetPasswordInvalid: FC = () => (
  <div className="space-y-4 text-center">
    <p className="text-sm font-medium text-[#b8473d]">
      Token reset password tidak valid atau tidak ditemukan.
    </p>
    <Link
      href={'/forgot-password' as Route}
      className="inline-flex group items-center gap-2 text-sm font-bold text-[#11233f] transition hover:text-[#ff7a45]"
    >
      Minta ulang tautan reset
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
    </Link>
  </div>
);

export default ResetPasswordInvalid;
