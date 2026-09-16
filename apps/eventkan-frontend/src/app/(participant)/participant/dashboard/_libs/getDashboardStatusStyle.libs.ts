import type { DashboardStatusStyle } from '@/interfaces/features/dashboard';

export const getDashboardStatusStyle = (status: string): DashboardStatusStyle => {
  switch (status) {
    case 'CHECKED_IN':
      return {
        label: 'Hadir',
        bg: 'var(--eventkan-green-soft)',
        color: 'var(--eventkan-green-ink)',
        border: 'var(--eventkan-green)',
      };
    case 'REGISTERED':
      return {
        label: 'Terdaftar',
        bg: 'var(--eventkan-canvas)',
        color: '#4b5565',
        border: 'rgba(17,25,39,.12)',
      };
    case 'WAITING_PAYMENT':
      return {
        label: 'Menunggu Bayar',
        bg: 'var(--eventkan-peach)',
        color: '#b84a2a',
        border: 'rgba(255,122,69,.3)',
      };
    case 'CANCELLED':
      return {
        label: 'Dibatalkan',
        bg: 'var(--eventkan-peach)',
        color: '#8d492e',
        border: 'rgba(184,74,42,.25)',
      };
    default:
      return {
        label: status,
        bg: 'var(--eventkan-canvas)',
        color: 'var(--eventkan-muted)',
        border: 'rgba(17,25,39,.12)',
      };
  }
};
