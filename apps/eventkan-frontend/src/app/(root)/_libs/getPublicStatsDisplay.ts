import type { PublicStats } from '@/interfaces/features/dashboard';

export const getPublicStatsDisplay = ({
  events,
  registrations,
  certificates,
}: PublicStats) => [
  { value: `${Math.max(events, 12)}+`, label: 'Event Aktif' },
  {
    value: `${Math.max(registrations, 300).toLocaleString('id-ID')}+`,
    label: 'Peserta Terdaftar',
  },
  {
    value: `${Math.max(certificates, 300).toLocaleString('id-ID')}+`,
    label: 'Sertifikat Diterbitkan',
  },
];
