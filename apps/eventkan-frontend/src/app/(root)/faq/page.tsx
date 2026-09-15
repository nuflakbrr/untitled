import type { Metadata } from 'next';

import { genPageMetadata } from '@/app/seo';

import FAQPageClient from './_components/FAQPageClient';

export const metadata: Metadata = genPageMetadata({
  title: 'Pusat Bantuan & FAQ',
  description:
    'Temukan jawaban seputar akun, pendaftaran event, e-ticket, pembayaran, refund, dan layanan EVENTKAN.',
});

export default function FAQPage() {
  return <FAQPageClient />;
}
