export const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  master: 'Data Master',
  'event-categories': 'Kategori Event',
  events: 'Event',
  certificates: 'Sertifikat',
  transactions: 'Transaksi',
  registrations: 'Pendaftaran',
  payments: 'Pembayaran',
  attendance: 'Kehadiran',
  scan: 'Scan QR',
  managements: 'Manajemen',
  users: 'Pengguna',
  roles: 'Jabatan',
  permissions: 'Hak Akses',
  tenants: 'Organisasi',
  new: 'Tambah',
  publications: 'Publikasi',
  articles: 'Artikel',
  galleries: 'Galeri',
};

export const resolvableBreadcrumbParents = [
  'event-categories',
  'events',
  'certificates',
  'transactions',
  'registrations',
  'payments',
  'attendance',
  'scan',
  'users',
  'roles',
  'permissions',
  'tenants',
  'articles',
  'galleries',
];

export const nonClickableBreadcrumbs = new Set([
  'transactions',
  'registrations',
  'payments',
  'attendance',
  'scan',
]);

export const isUUID = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const formatBreadcrumbSegment = (segment: string, resolvedLabels: Record<string, string>) =>
  breadcrumbLabels[segment] ??
  resolvedLabels[segment] ??
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
