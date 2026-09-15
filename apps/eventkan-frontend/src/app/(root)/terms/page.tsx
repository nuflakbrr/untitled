import type { Metadata } from 'next';

import { genPageMetadata } from '@/app/seo';

import LegalPageLayout from '../_components/LegalPageLayout';
import { termsSections } from './_constants/sections.constants';

export const metadata: Metadata = genPageMetadata({
  title: 'Syarat & Ketentuan',
  description:
    'Baca syarat dan ketentuan penggunaan platform EVENTKAN sebelum menggunakan layanan kami.',
});

export default function TermsConditions() {
  return (
    <LegalPageLayout
      title="Syarat & Ketentuan"
      description="Aturan dasar penggunaan akun, pendaftaran event, pembayaran, konten, dan layanan EVENTKAN."
      lastUpdated={process.env.TERMS_LAST_UPDATED ?? '12 Juli 2026'}
      noticeTitle="Sebelum menggunakan EVENTKAN"
      notice="Dokumen ini merupakan perjanjian hukum antara Anda dan EVENTKAN. Dengan mendaftar atau menggunakan layanan kami, Anda dianggap telah membaca dan menyetujui seluruh ketentuan di bawah ini."
      sections={termsSections}
      ctaTitle="Masih ada yang belum jelas?"
      ctaDescription="Gunakan Pusat Bantuan jika ada bagian yang perlu dijelaskan lebih lanjut."
    />
  );
}
