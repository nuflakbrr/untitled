import { AlertCircle } from 'lucide-react';

import type { DashboardHeaderProps } from '@/interfaces/features/dashboard';

export default function DashboardHeader({ userName, emailVerified }: DashboardHeaderProps) {
  return (
    <>
      {!emailVerified && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-eventkan-accent/30 bg-eventkan-peach p-4 text-[#8d492e]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-eventkan-accent" />
          <div>
            <h4 className="text-sm font-bold text-eventkan-navy">Verifikasi email diperlukan</h4>
            <p className="mt-1 text-xs leading-relaxed">
              Akun Anda belum memverifikasi alamat email. Silakan periksa kotak masuk utama
              (Primary) atau folder spam/promosi email Anda untuk melakukan verifikasi akun.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col items-start justify-between gap-7 border-b border-eventkan-ink/10 pb-8 sm:flex-row sm:items-end">
        <div>
          <h1
            id="dashboard-title"
            className="font-display mt-2 text-[clamp(38px,5vw,58px)] font-extrabold leading-none tracking-tighter text-eventkan-ink"
          >
            Halo, <span className="text-eventkan-accent">{userName}</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-eventkan-muted">
            Lagi cari event seru? Pilih yang paling cocok buat kamu, daftar, lalu tinggal gas!
            Tiket, kehadiran, pembayaran, sampai sertifikat bisa kamu cek di sini.
          </p>
        </div>
      </div>
    </>
  );
}
