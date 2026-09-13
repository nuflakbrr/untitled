import type { FAQItem } from '@/interfaces/faq';

export const faqCategories = [
  { id: 'semua', label: 'Semua Pertanyaan' },
  { id: 'umum', label: 'Umum' },
  { id: 'peserta', label: 'Untuk Peserta' },
  { id: 'penyelenggara', label: 'Untuk Penyelenggara' },
  { id: 'pembayaran', label: 'Pembayaran & Tiket' },
] as const;

export const faqCategoryLabels: Record<FAQItem['category'], string> = {
  umum: 'Umum',
  peserta: 'Untuk Peserta',
  penyelenggara: 'Untuk Penyelenggara',
  pembayaran: 'Pembayaran & Tiket',
};

export const faqItems: FAQItem[] = [
  {
    id: 'apa-itu-sitivent',
    category: 'umum',
    question: 'Apa itu SITIVENT?',
    answer:
      'SITIVENT adalah platform manajemen dan pencarian event terintegrasi yang memudahkan penyelenggara untuk mempublikasikan, mengelola pendaftaran, dan mendistribusikan tiket event, serta membantu peserta menemukan berbagai event menarik seperti seminar, workshop, webinar, dan kompetisi.',
  },
  {
    id: 'apakah-daftar-gratis',
    category: 'umum',
    question: 'Apakah mendaftar di SITIVENT gratis?',
    answer:
      'Ya, pendaftaran akun untuk peserta maupun penyelenggara di SITIVENT sepenuhnya gratis tanpa biaya bulanan atau biaya tersembunyi.',
  },
  {
    id: 'bagaimana-cara-beli-tiket',
    category: 'peserta',
    question: 'Bagaimana cara membeli tiket event?',
    answer:
      'Cari event yang Anda inginkan melalui fitur pencarian atau halaman jelajah, klik tombol "Daftar Event" atau "Beli Tiket", pilih kategori tiket, kemudian lakukan pembayaran menggunakan metode pembayaran instan yang tersedia. E-tiket akan otomatis dikirimkan ke email Anda dan muncul di dashboard peserta.',
  },
  {
    id: 'dimana-melihat-tiket',
    category: 'peserta',
    question: 'Di mana saya bisa melihat e-tiket yang sudah dibeli?',
    answer:
      'Semua tiket aktif yang telah Anda beli dapat diakses kapan saja melalui dashboard akun peserta pada menu "Tiket Saya". Anda hanya perlu menunjukkan kode QR pada tiket tersebut kepada panitia di lokasi event untuk verifikasi kehadiran.',
  },
  {
    id: 'cara-buat-event',
    category: 'penyelenggara',
    question: 'Bagaimana cara mempublikasikan event saya sendiri?',
    answer:
      'Setelah mendaftar dan masuk ke akun penyelenggara, buka dashboard admin lalu pilih menu "Manajemen Event" > "Tambah Event". Isi seluruh informasi detail event seperti judul, deskripsi, kategori, tanggal, tipe (online/offline), kuota, dan harga tiket. Tim kami akan melakukan verifikasi singkat sebelum event Anda ditayangkan.',
  },
  {
    id: 'metode-pembayaran-apa-saja',
    category: 'pembayaran',
    question: 'Metode pembayaran apa saja yang didukung oleh SITIVENT?',
    answer:
      'Kami mendukung berbagai metode pembayaran instan dan aman, termasuk transfer bank virtual account (VA), e-wallet populer (GoPay, OVO, Dana), QRIS, serta pembayaran melalui gerai retail minimarket.',
  },
  {
    id: 'kebijakan-refund',
    category: 'pembayaran',
    question: 'Apakah tiket yang sudah dibeli bisa dibatalkan atau direfund?',
    answer:
      'Kebijakan pembatalan dan pengembalian uang (refund) tiket sepenuhnya ditentukan oleh masing-masing penyelenggara event. Silakan cek syarat ketentuan khusus pada halaman detail event yang bersangkutan atau hubungi langsung penyelenggara melalui detail kontak yang tertera.',
  },
  {
    id: 'cara-tarik-dana',
    category: 'penyelenggara',
    question: 'Bagaimana proses penarikan dana penjualan tiket bagi penyelenggara?',
    answer:
      'Penyelenggara dapat mengajukan penarikan dana penjualan tiket langsung melalui menu "Keuangan" di dashboard admin setelah event selesai dilaksanakan. Proses verifikasi dan transfer ke rekening bank penyelenggara membutuhkan waktu maksimal 3 hari kerja.',
  },
  {
    id: 'cara-hubungi-support',
    category: 'umum',
    question: 'Bagaimana jika saya mengalami kendala teknis?',
    answer:
      'Tim bantuan pelanggan kami siap membantu Anda. Silakan hubungi kami melalui email indevappfti@gmail.com atau melalui form di halaman Kontak. Kami akan merespons pertanyaan Anda secepat mungkin.',
  },
];
