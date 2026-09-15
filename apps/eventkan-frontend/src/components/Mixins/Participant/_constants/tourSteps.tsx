import { Award, CreditCard, UserCircle, CalendarDays, LayoutDashboard } from 'lucide-react';

const steps = [
  { key: 'dashboard', icon: LayoutDashboard, title: 'Dashboard Peserta', description: 'Ini adalah pusat kontrol utama Anda di EVENTKAN. Di sini Anda dapat melihat statistik ringkasan, info e-tiket event terdekat, serta pengumuman penting.' },
  { key: 'history', icon: CalendarDays, title: 'Riwayat Event & E-Tiket', description: 'Lihat semua event yang pernah Anda daftari, periksa status hadir (CHECKED_IN), akses e-tiket QR code, unduh sertifikat, dan berikan ulasan testimoni.' },
  { key: 'payments', icon: CreditCard, title: 'Riwayat Transaksi & Pembayaran', description: 'Kelola dan pantau seluruh transaksi event berbayar Anda, lalu dapatkan konfirmasi pembayaran otomatis dari payment gateway.' },
  { key: 'certificates', icon: Award, title: 'Sertifikat Event', description: 'Akses dan unduh sertifikat event yang sudah Anda ikuti setelah status kehadiran dan penerbitannya tersedia.' },
  { key: 'profile', icon: UserCircle, title: 'Profil & Pengaturan Akun', description: 'Perbarui data pribadi dan informasi penting akun peserta Anda kapan saja melalui menu profil.' },
] as const;

function StepContent({ step }: { step: (typeof steps)[number] }) {
  const Icon = step.icon;
  return (
    <div className="space-y-2 p-1">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#ff7a45]" />
        <h4 className="text-base font-bold text-[#11233f]">{step.title}</h4>
      </div>
      <p className="text-xs leading-relaxed text-[#6c7280]">{step.description}</p>
    </div>
  );
}

export function getParticipantTourSteps(isMobile: boolean) {
  return steps.map((step) => ({
    selector: `[data-tour-${isMobile ? 'mobile' : 'desktop'}="step-${step.key}"]`,
    ...(isMobile ? { mutationObservables: ['body'], resizeObservables: ['body'] } : {}),
    content: () => <StepContent step={step} />,
  }));
}
