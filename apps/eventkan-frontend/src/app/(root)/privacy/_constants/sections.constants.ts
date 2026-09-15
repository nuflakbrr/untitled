import type { LegalSection } from '@/interfaces/legal';

export const privacySections: LegalSection[] = [
  {
    id: 'pengumpulan-data',
    title: '1. Data yang Kami Kumpulkan',
    content: [
      'Kami mengumpulkan data yang Anda berikan secara langsung ketika mendaftar akun, mendaftarkan diri ke event, atau menghubungi tim kami. Data tersebut meliputi: nama lengkap, alamat email, nomor telepon (opsional), dan informasi profil lainnya.',
      'Secara otomatis kami juga mengumpulkan data teknis seperti alamat IP, jenis perangkat, browser yang digunakan, halaman yang dikunjungi, serta waktu dan tanggal akses. Data ini digunakan untuk meningkatkan performa dan keamanan platform.',
      'Kami tidak mengumpulkan data sensitif seperti nomor rekening bank, informasi kartu kredit secara langsung, transaksi pembayaran diproses melalui penyedia pembayaran pihak ketiga yang tersertifikasi.',
    ],
  },
  {
    id: 'penggunaan-data',
    title: '2. Cara Kami Menggunakan Data',
    content: [
      'Data Anda digunakan untuk: mengelola akun dan memberikan akses ke layanan EVENTKAN, memproses pendaftaran event dan mengirimkan konfirmasi, mengirimkan notifikasi event yang relevan berdasarkan minat Anda, serta merespons pertanyaan dan permintaan dukungan.',
      'Kami menggunakan data agregat (non-identitas) untuk analisis internal guna meningkatkan kualitas platform, merekomendasikan event yang sesuai, dan mengembangkan fitur baru.',
      'Kami tidak menjual data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit Anda.',
    ],
  },
  {
    id: 'berbagi-data',
    title: '3. Berbagi Data dengan Pihak Ketiga',
    content: [
      'Kami dapat berbagi data Anda dengan penyelenggara event yang Anda daftarkan, sebatas data yang diperlukan untuk keperluan kehadiran dan administrasi event tersebut.',
      'Kami bekerja sama dengan penyedia layanan tepercaya (seperti layanan email, analitik, dan pembayaran) yang terikat perjanjian kerahasiaan dan hanya boleh menggunakan data Anda sesuai instruksi kami.',
      'Kami dapat mengungkapkan data jika diwajibkan oleh hukum atau peraturan yang berlaku di Indonesia, atau untuk melindungi hak, properti, dan keselamatan EVENTKAN maupun pengguna lain.',
    ],
  },
  {
    id: 'keamanan',
    title: '4. Keamanan Data',
    content: [
      'Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi data pribadi Anda dari akses tidak sah, kehilangan, atau pengungkapan. Ini mencakup enkripsi data saat transit (HTTPS/TLS) dan penyimpanan password menggunakan algoritma hashing modern.',
      'Meskipun kami berupaya keras melindungi data Anda, tidak ada sistem yang sepenuhnya bebas risiko. Kami mendorong Anda untuk menggunakan password yang kuat dan tidak membagikan kredensial akun kepada siapapun.',
    ],
  },
  {
    id: 'hak-pengguna',
    title: '5. Hak-Hak Anda',
    content: [
      'Anda memiliki hak untuk: mengakses data pribadi yang kami simpan tentang Anda, meminta koreksi jika data Anda tidak akurat, meminta penghapusan akun dan data pribadi Anda (dengan catatan beberapa data mungkin tetap disimpan sesuai kewajiban hukum), serta mencabut persetujuan pengiriman notifikasi pemasaran kapan saja.',
      'Untuk menggunakan hak-hak di atas, silakan hubungi kami melalui halaman kontak atau email yang tertera di bagian bawah halaman ini.',
    ],
  },
  {
    id: 'cookie',
    title: '6. Cookie & Teknologi Pelacakan',
    content: [
      'EVENTKAN menggunakan cookie dan teknologi serupa untuk menjaga sesi login Anda, mengingat preferensi, serta memahami bagaimana pengguna berinteraksi dengan platform kami.',
      'Anda dapat mengatur browser untuk menolak cookie, namun hal ini dapat memengaruhi fungsionalitas tertentu di platform kami seperti kemampuan untuk tetap masuk (stay logged in).',
    ],
  },
  {
    id: 'perubahan',
    title: '7. Perubahan Kebijakan',
    content: [
      'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform. Tanggal "terakhir diperbarui" di bagian atas halaman ini mencerminkan versi terkini.',
      'Penggunaan EVENTKAN setelah tanggal pembaruan dianggap sebagai persetujuan Anda terhadap kebijakan yang telah diubah.',
    ],
  },
  {
    id: 'kontak',
    title: '8. Hubungi Kami',
    content: [
      'Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini, silakan hubungi tim kami melalui halaman Kontak atau kirim email ke naufalakbar378@gmail.com.',
    ],
  },
];;
