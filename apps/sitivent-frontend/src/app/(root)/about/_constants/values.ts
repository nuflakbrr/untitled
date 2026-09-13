import { Zap, Award, Users, Shield } from 'lucide-react';

import type { AboutValue } from '@/interfaces/features/about';

export const aboutValues: AboutValue[] = [
  {
    icon: Zap,
    title: 'Efisiensi',
    desc: 'Proses pendaftaran cepat dan mudah, tanpa kerumitan.',
    color: '#ff7a45',
    bg: 'rgba(255,122,69,.08)',
    border: 'rgba(255,122,69,.3)',
  },
  {
    icon: Shield,
    title: 'Transparansi',
    desc: 'Setiap transaksi dan status terpantau secara real-time.',
    color: '#36784b',
    bg: 'rgba(54,120,75,.08)',
    border: 'rgba(54,120,75,.3)',
  },
  {
    icon: Users,
    title: 'Inklusif',
    desc: 'Terbuka untuk semua kalangan, dari pelajar hingga profesional.',
    color: '#ff7a45',
    bg: 'rgba(255,122,69,.08)',
    border: 'rgba(255,122,69,.3)',
  },
  {
    icon: Award,
    title: 'Bermutu',
    desc: 'Event terkurasi dengan materi berkualitas dan instruktur berpengalaman.',
    color: '#36784b',
    bg: 'rgba(54,120,75,.08)',
    border: 'rgba(54,120,75,.3)',
  },
];
