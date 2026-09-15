import type { DashboardStatusStyle } from '@/interfaces/features/dashboard';

export const getDashboardStatusStyle = (status: string): DashboardStatusStyle => {
  switch (status) {
    case 'CHECKED_IN':
      return {
        label: 'Hadir',
        bg: '#e5f2e8',
        color: '#36784b',
        border: '#bfe4c7',
      };
    case 'REGISTERED':
      return {
        label: 'Terdaftar',
        bg: '#f6f3eb',
        color: '#4b5565',
        border: 'rgba(17,25,39,.12)',
      };
    case 'WAITING_PAYMENT':
      return {
        label: 'Menunggu Bayar',
        bg: '#ffe5d8',
        color: '#b84a2a',
        border: 'rgba(255,122,69,.3)',
      };
    case 'CANCELLED':
      return {
        label: 'Dibatalkan',
        bg: '#ffe5d8',
        color: '#8d492e',
        border: 'rgba(184,74,42,.25)',
      };
    default:
      return {
        label: status,
        bg: '#f6f3eb',
        color: '#6c7280',
        border: 'rgba(17,25,39,.12)',
      };
  }
};
