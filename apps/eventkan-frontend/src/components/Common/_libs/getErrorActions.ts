import type { ErrorAction } from '@/interfaces/error';

export const getErrorActions = (code: number): [ErrorAction, ErrorAction] => {
  if (code === 401 || code === 403) {
    return [
      { href: '/login', label: 'Masuk ke Akun' },
      { href: '/', label: 'Kembali ke Beranda' },
    ];
  }

  if (code === 404) {
    return [
      { href: '/events', label: 'Cari Event' },
      { href: '/', label: 'Kembali ke Beranda' },
    ];
  }

  return [
    { href: '/', label: code === 503 ? 'Coba dari Beranda' : 'Kembali ke Beranda' },
    { href: '/help', label: code === 503 ? 'Pusat Bantuan' : 'Laporkan Kendala' },
  ];
};
