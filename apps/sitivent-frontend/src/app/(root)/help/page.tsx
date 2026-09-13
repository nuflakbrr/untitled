import type { Metadata } from 'next';

import { genPageMetadata } from '@/app/seo';

import HelpPageClient from './_components/HelpPageClient';

export const metadata: Metadata = genPageMetadata({
  title: 'Pusat Bantuan',
  description:
    'Hubungi tim SITIVENT untuk mendapatkan bantuan seputar akun, pendaftaran event, tiket, pembayaran, dan sertifikat.',
});

export default function HelpPage() {
  return <HelpPageClient />;
}
