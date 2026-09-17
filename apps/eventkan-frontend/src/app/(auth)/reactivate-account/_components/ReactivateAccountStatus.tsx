import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

import type { ReactivateAccountStatusProps } from '@/interfaces/features/auth';

export default function ReactivateAccountStatus({
  variant,
  isReactivated = false,
}: ReactivateAccountStatusProps) {
  if (variant === 'email') {
    return (
      <div className="rounded-[20px] bg-eventkan-green p-6 text-left sm:p-7">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/55 text-eventkan-green-ink">
            <Mail className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl font-extrabold leading-none text-eventkan-navy">
            Cek email kamu.
          </h3>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-eventkan-navy/70">
          Jika akun dapat diaktifkan kembali, kami akan mengirim tautan ke email tersebut.
        </p>
        <p className="mt-4 text-xs leading-relaxed text-eventkan-muted">
          Kalau akunmu masih aktif, langsung{' '}
          <Link
            href="/login"
            className="font-bold text-eventkan-navy transition hover:text-eventkan-accent"
          >
            masuk
          </Link>
          .
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
