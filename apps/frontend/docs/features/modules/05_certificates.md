# Frontend Feature: Desain Sertifikat & Verifikasi Publik - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Certificate Builder & Public Verification UI  
> **Stack**: Next.js 16 + Material UI v9 + HTML Canvas / PDF Rendering

---

## 1. Certificate Template Builder (`src/sections/admin/certificates/`)

- Antarmuka visual kustomisasi template sertifikat:
  - Unggah latar belakang gambar kustom.
  - Pilihan font (Serif, Sans-serif, Playfair, Inter) dan warna teks.
  - Penambahan tanda tangan digital multi-penandatangan (unggah PNG transparan).
  - Pratinjau langsung di browser secara real-time.

---

## 2. Halaman Verifikasi Publik (`src/app/certificates/[id]/page.tsx`)

- Terbuka untuk umum tanpa login.
- Memverifikasi ID atau nomor seri sertifikat melalui API `GET /features/v1/certificates/:id/verify`.
- Menampilkan status keaslian, nama peserta, instansi, tanggal terbit, dan tombol unduh PDF resmi.
