import type { Metadata } from 'next';

import { genPageMetadata } from '@/app/seo';

import LegalPageLayout from '../_components/LegalPageLayout';
import { privacySections } from './_constants/sections.constants';

export const metadata: Metadata = genPageMetadata({
  title: 'Kebijakan Privasi',
  description:
    'Baca kebijakan privasi EVENTKAN, bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
});

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Kebijakan Privasi"
      description="Gambaran tentang bagaimana informasi pengguna dipakai, dilindungi, dan dikelola ketika menggunakan EVENTKAN."
      lastUpdated={process.env.PRIVACY_LAST_UPDATED ?? '12 Juli 2026'}
      noticeTitle="Privasi adalah bagian dari pengalaman EVENTKAN"
      notice="Kebijakan ini menjelaskan bagaimana data digunakan, dilindungi, dan dikelola saat Anda menggunakan layanan kami."
      sections={privacySections}
      ctaTitle="Punya pertanyaan tentang datamu?"
      ctaDescription="Gunakan Pusat Bantuan jika ada bagian yang perlu dijelaskan lebih lanjut."
    />
  );
}
