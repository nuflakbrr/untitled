import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

import type { ReactivateAccountStatusProps } from '@/interfaces/features/auth';

export default function ReactivateAccountStatus({
  variant,
  isReactivated = false,
}: ReactivateAccountStatusProps) {
  if (variant === 'email') {
    return (
      <div className="space-y-3 text-center">
        <Mail className="mx-auto h-10 w-10 text-eventkan-green-ink" />
        <h3 className="font-display text-xl font-extrabold text-eventkan-navy">Cek emailmu.</h3>
        <p className="text-sm leading-relaxed text-eventkan-muted">
          Jika akun dapat diaktifkan kembali, kami akan mengirim tautan ke email tersebut.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-eventkan-green-ink" />
      <h3 className="font-display text-xl font-extrabold text-eventkan-navy">
        {isReactivated ? 'Akun berhasil diaktifkan.' : 'Memproses aktivasi akun...'}
      </h3>
      {isReactivated && (
        <Link
          href="/login"
          className="group inline-flex items-center gap-2 rounded-full bg-eventkan-navy px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-eventkan-navy-hover"
        >
          Masuk ke EVENTKAN
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
        </Link>
      )}
    </div>
  );
}
