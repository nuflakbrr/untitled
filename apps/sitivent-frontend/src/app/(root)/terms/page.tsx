import type { Metadata } from 'next';

import { genPageMetadata } from '@/app/seo';

import { termsSections } from './_constants/sections';
import LegalPageLayout from '../_components/LegalPageLayout';

export const metadata: Metadata = genPageMetadata({
  title: 'Syarat & Ketentuan',
  description:
    'Baca syarat dan ketentuan penggunaan platform SITIVENT sebelum menggunakan layanan kami.',
});

export default function TermsConditions() {
  return (
    <LegalPageLayout
      title="Syarat & Ketentuan"
      description="Aturan dasar penggunaan akun, pendaftaran event, pembayaran, konten, dan layanan SITIVENT."
      lastUpdated={process.env.TERMS_LAST_UPDATED ?? '12 Juli 2026'}
      noticeTitle="Sebelum menggunakan SITIVENT"
      notice="Dokumen ini merupakan perjanjian hukum antara Anda dan SITIVENT. Dengan mendaftar atau menggunakan layanan kami, Anda dianggap telah membaca dan menyetujui seluruh ketentuan di bawah ini."
      sections={termsSections}
      ctaTitle="Masih ada yang belum jelas?"
      ctaDescription="Gunakan Pusat Bantuan jika ada bagian yang perlu dijelaskan lebih lanjut."
    />
  );
}
