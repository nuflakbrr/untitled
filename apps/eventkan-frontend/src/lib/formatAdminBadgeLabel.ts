const ACTION_LABELS: Record<string, string> = {
  access: 'Akses',
  cancel: 'Batalkan',
  create: 'Buat',
  delete: 'Hapus',
  download: 'Unduh',
  publish: 'Terbitkan',
  read: 'Lihat',
  scan: 'Pindai',
  update: 'Ubah',
  verify: 'Verifikasi',
};

const MODULE_LABELS: Record<string, string> = {
  article: 'Artikel',
  articles: 'Artikel',
  categories: 'Kategori',
  category: 'Kategori',
  attendance: 'Presensi',
  certificates: 'Sertifikat',
  event: 'Event',
  events: 'Event',
  galleries: 'Galeri',
  payments: 'Pembayaran',
  permission: 'Hak Akses',
  registrations: 'Pendaftaran',
  role: 'Jabatan',
  tenant: 'Organisasi',
  testimonies: 'Testimoni',
  user: 'Pengguna',
};

export const SUPPORT_STATUS_CONFIG = {
  PENDING: {
    className: 'bg-eventkan-peach text-eventkan-peach-ink',
  },
  PROCESS: {
    className: 'bg-eventkan-yellow text-eventkan-ink',
  },
  RESOLVED: {
    className: 'bg-eventkan-green text-eventkan-green-ink',
  },
} as const;

export const getSupportCategoryClass = (category: string) => {
  const value = category.toLowerCase();
  if (value.includes('bayar') || value.includes('payment')) {
    return 'bg-eventkan-green text-eventkan-green-ink';
  }
  if (value.includes('event')) {
    return 'bg-eventkan-navy/8 text-eventkan-navy';
  }
  if (value.includes('akun') || value.includes('account')) {
    return 'bg-eventkan-accent/10 text-eventkan-accent';
  }
  return 'bg-eventkan-yellow text-eventkan-ink';
};

export const formatSupportCategoryLabel = (category: string) => {
  const value = category.toLowerCase();
  if (value.includes('bayar') || value.includes('payment')) return 'Pembayaran & Tiket';
  if (value.includes('registration') || value.includes('pendaftaran')) return 'Pendaftaran';
  if (value.includes('event')) return 'Event';
  if (value.includes('akun') || value.includes('account')) return 'Akun';
  return formatEnumLabel(category);
};

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatEnumLabel = (value: string) => toTitleCase(value);

export const formatEventTypeLabel = (value: string) =>
  ({ ONLINE: 'Daring', OFFLINE: 'Luring' })[value] ?? formatEnumLabel(value);

export const formatEventStatusLabel = (value: string) =>
  ({
    CLOSED: 'Ditutup',
    COMPLETED: 'Selesai',
    DRAFT: 'Draf',
    PUBLISHED: 'Diterbitkan',
  })[value] ?? formatEnumLabel(value);

export const formatTenantTypeLabel = (value: string) =>
  ({ FACULTY: 'Fakultas', ROOT: 'Universitas' })[value] ?? formatEnumLabel(value);

export const formatRoleLabel = (value: string) =>
  ({
    panitia: 'Panitia',
    peserta: 'Peserta',
    root_superadmin: 'Superadmin Universitas',
    scanner: 'Petugas Presensi',
    superadmin: 'Superadmin',
  })[value.toLowerCase()] ?? toTitleCase(value);

export const formatPermissionLabel = (value: string) => {
  const parts = value.split('.').filter(Boolean);
  if (parts.length === 0) return '';

  const action = parts.pop();
  const scopeLabel = parts
    .map((part, index) =>
      index === 0
        ? MODULE_LABELS[part.toLowerCase()] ?? toTitleCase(part)
        : MODULE_LABELS[part.toLowerCase()] ?? toTitleCase(part)
    )
    .join(' · ');
  const actionLabel = ACTION_LABELS[action?.toLowerCase() ?? ''] ?? toTitleCase(action ?? '');

  return scopeLabel && action ? `${scopeLabel} · ${actionLabel}` : scopeLabel || actionLabel;
};

export const formatGalleryFeaturedLabel = (featured: boolean) =>
  featured ? 'Unggulan' : 'Standar';

export const formatDeletedStatusLabel = (deleted: boolean) => (deleted ? 'Terhapus' : 'Aktif');

export const formatCertificateDownloadLabel = (downloaded: boolean, date?: string) =>
  downloaded && date ? `Sudah Diunduh (${date})` : 'Belum Diunduh';

export const formatPaymentStatusLabel = (value: string) =>
  ({
    FAILED: 'Ditolak',
    PAID: 'Lunas',
    REFUNDED: 'Dikembalikan',
    WAITING: 'Menunggu Pembayaran',
  })[value] ?? formatEnumLabel(value);

export const formatRegistrationStatusLabel = (value: string) =>
  ({
    CANCELLED: 'Dibatalkan',
    CHECKED_IN: 'Hadir',
    REGISTERED: 'Terdaftar',
    WAITING_PAYMENT: 'Menunggu Pembayaran',
  })[value] ?? formatEnumLabel(value);

export const formatSupportStatusLabel = (value: string) =>
  ({ PENDING: 'Menunggu', PROCESS: 'Diproses', RESOLVED: 'Selesai' })[value] ?? formatEnumLabel(value);

export const formatAttendanceProofStatusLabel = (value: string) =>
  ({ APPROVED: 'Disetujui', NONE: 'Belum Ada', PENDING: 'Menunggu Review', REJECTED: 'Ditolak' })[
    value
  ] ?? formatEnumLabel(value);

export const formatScanCodeLabel = (value?: string, isSuccess = false) => {
  if (value === 'CHECKED_IN') return 'Presensi Berhasil';
  if (value === 'FAILED') return 'Presensi Gagal';
  return value ? formatEnumLabel(value) : isSuccess ? 'Presensi Berhasil' : 'Presensi Gagal';
};

export const formatScannerStateLabel = (state: 'processing' | 'disabled' | 'insecure') =>
  ({
    disabled: 'Kamera Dinonaktifkan',
    insecure: 'Koneksi Tidak Aman',
    processing: 'Memproses QR Code...',
  })[state];
