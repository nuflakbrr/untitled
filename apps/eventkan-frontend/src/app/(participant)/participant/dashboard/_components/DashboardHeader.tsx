import { AlertCircle } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  emailVerified: boolean;
}

export default function DashboardHeader({ userName, emailVerified }: DashboardHeaderProps) {
  return (
    <>
      {!emailVerified && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-[#ff7a45]/30 bg-[#ffe5d8] p-4 text-[#8d492e]">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff7a45]" />
          <div>
            <h4 className="text-sm font-bold text-[#11233f]">Verifikasi email diperlukan</h4>
            <p className="mt-1 text-xs leading-relaxed">
              Akun Anda belum memverifikasi alamat email. Silakan periksa kotak masuk utama
              (Primary) atau folder spam/promosi email Anda untuk melakukan verifikasi akun.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col items-start justify-between gap-7 border-b border-[#111927]/10 pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="block text-xs font-extrabold uppercase tracking-[.08em] text-[#ff7a45]">
            Dashboard Peserta
          </span>
          <h1 id="dashboard-title" className="font-display mt-2 text-[clamp(38px,5vw,58px)] font-extrabold leading-none tracking-[-.05em] text-[#111927]">
            Halo, {userName}.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6c7280]">
            Semua aktivitas event kamu ada di satu tempat: registrasi, kehadiran, pembayaran, dan sertifikat.
          </p>
        </div>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto">
          <a href="/events" className="inline-flex flex-1 items-center justify-center rounded-full bg-[#11233f] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458] sm:flex-none">
            Jelajahi Event ↗
          </a>
          <a href="/participant/profile" className="inline-flex flex-1 items-center justify-center rounded-full border border-[#111927]/12 px-4 py-3 text-sm font-bold text-[#11233f] transition hover:bg-[#fffdf8] sm:flex-none">
            Profil Saya
          </a>
        </div>
      </div>
    </>
  );
}
