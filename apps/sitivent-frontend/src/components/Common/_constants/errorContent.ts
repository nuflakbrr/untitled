import type { ErrorMetadata } from '@/interfaces/error';

export const getErrorContent = (statusCode: number): ErrorMetadata => {
  const metadataMap: Record<number, ErrorMetadata> = {
    401: {
      titlePrefix: 'Masuk untuk',
      titleSuffix: 'Melanjutkan',
      description:
        'Sesi kamu sudah berakhir atau halaman ini membutuhkan akun. Masuk kembali untuk melanjutkan perjalananmu di SITIVENT.',
      badge: 'Sesi perlu diperbarui',
      theme: 'amber',
    },
    403: {
      titlePrefix: 'Kamu belum punya',
      titleSuffix: 'akses ke halaman ini.',
      description:
        'Halaman ini tersedia untuk role atau akun tertentu. Pastikan kamu masuk dengan akun yang sesuai sebelum mencoba lagi.',
      badge: 'Akses dibatasi',
      theme: 'amber',
    },
    404: {
      titlePrefix: 'Sepertinya event ini sudah',
      titleSuffix: 'pindah tempat.',
      description:
        'Alamat yang kamu buka tidak tersedia, sudah dipindahkan, atau mungkin ada kesalahan pada URL.',
      badge: 'Halaman tidak ditemukan',
      theme: 'rose',
    },
    500: {
      titlePrefix: 'Sistemnya sedang',
      titleSuffix: 'tidak baik-baik saja.',
      description:
        'Terjadi kesalahan di sisi server saat memproses permintaanmu. Data dan tiketmu tidak perlu dikirim ulang berulang kali.',
      badge: 'Server bermasalah',
      theme: 'amber',
    },
    503: {
      titlePrefix: 'SITIVENT sedang',
      titleSuffix: 'beres-beres sebentar.',
      description:
        'Layanan sedang dalam pemeliharaan atau mengalami lonjakan trafik. Coba kembali beberapa saat lagi.',
      badge: 'Layanan sementara tidak tersedia',
      theme: 'emerald',
    },
  };

  const fallback: ErrorMetadata =
    statusCode >= 500
      ? {
          titlePrefix: 'Sistem sedang',
          titleSuffix: 'mengalami kendala.',
          description:
            'Server mengalami kendala yang tidak terduga. Mohon coba lagi beberapa saat lagi.',
          badge: 'Gangguan layanan',
          theme: 'amber',
        }
      : {
          titlePrefix: 'Permintaan tidak dapat',
          titleSuffix: 'diproses.',
          description: 'Sistem tidak dapat menemukan atau memproses halaman yang kamu minta.',
          badge: 'Terjadi kesalahan',
          theme: 'rose',
        };

  return metadataMap[statusCode] ?? fallback;
};
