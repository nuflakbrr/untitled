import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// Tambahkan menu baru SETELAH halamannya ada (path dari paths.ts, bukan '#').
export const navData = [
  { title: 'Beranda', path: paths.home },
  { title: 'Event', path: paths.event.root },
  { title: 'Galeri', path: paths.gallery },
  { title: 'Artikel', path: paths.article.root },
  { title: 'Tentang Kami', path: paths.about },
];
