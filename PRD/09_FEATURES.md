# Core Modules & Features - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> SITIVENT terdiri dari kumpulan modul terpadu yang dirancang untuk mendukung operasional event dari hulu ke hilir dalam arsitektur monorepo polyglot (Go Backend + Next.js Frontend).

---

## 1. Authentication & Identity Management

- **JWT & PBAC Architecture**:
  - Login email & password, registrasi akun peserta mandiri, verifikasi email otomatis, forgot password, dan reset password aman.
  - Dukungan Google OAuth / Firebase ID Token verification di backend.
- **Permission-Based Access Control (PBAC)**:
  - Manajemen Roles (`superadmin`, `panitia`, `scanner`, `peserta`).
  - Manajemen Permissions granular (`events.create`, `payments.verify`, `attendance.scan`, dll.).
  - Redis In-Memory Permission Cache untuk otorisasi berkecepatan tinggi (< 1ms).
  - Manajemen Pengguna: Assign role, status banned, ban reason, dan ban expiry.

---

## 2. Admin CMS Management & Master Data

- **Analytics Dashboard**: Kartu ringkasan metrik (Total Event, Registrasi, Omzet Finansial, Kehadiran Check-In, Sertifikat terbit) dan grafik interaktif performa event terpopuler.
- **Event Categories**: CRUD kategori event dengan penomoran slug unik.
- **Event Master**:
  - Pengaturan event `ONLINE` dan `OFFLINE`, lokasi fisik, link meeting virtual (Zoom/GMeet), dan flag `onlineAttendance`.
  - Multi-Speaker (nama, titel, perusahaan, URL, profil sosial media, avatar).
  - Event Benefits (daftar fasilitas & manfaat peserta dengan ikon dan urutan).
  - Pengaturan kuota pendaftar, harga tiket (gratis / berbayar), dan batas deadline pendaftaran.
  - Siklus status: `DRAFT` ➔ `PUBLISHED` ➔ `CLOSED` ➔ `COMPLETED`.
  - Rich Text Editor untuk deskripsi interaktif.
- **Galleries**: Manajemen foto dokumentasi kegiatan dengan status _featured_ dan galeri publik.
- **Publications (Articles)**: Manajemen artikel berita, panduan, dan tips dengan relasi kategori artikel.
- **Testimonials & Ratings**: Moderasi ulasan dan penilaian bintang (1-5) dari peserta event.
- **Support Inquiries**: Pengelolaan pesan bantuan & tiket kendala peserta dengan status `PENDING`, `PROCESS`, `RESOLVED`.

---

## 3. Transaction & Registration Engine

- **Pendaftaran Peserta**:
  - Validasi otomatis kuota dengan transactional row locking (`FOR UPDATE`), deadline, status publish, dan pencegahan duplikasi pendaftaran per user.
  - Generasi otomatis **Nomor Registrasi** dan **QR Token** acak yang aman.
  - Auto-approval untuk event gratis (`price = 0` ➔ status `REGISTERED`).
- **Verifikasi Pembayaran**:
  - Alur upload bukti transfer manual untuk event berbayar (`WAITING_PAYMENT` ➔ `WAITING`).
  - Pratinjau bukti bayar dan verifikasi persetujuan admin (`PAID` ➔ status registrasi menjadi `REGISTERED`).
  - Penolakan bukti transfer palsu (`FAILED`) dan pencatatan pengembalian dana (`REFUNDED`).
  - Pencatatan audit trail otomatis (`audit_logs`) atas setiap tindakan verifikasi admin.
- **Ekspor Data**: Download data peserta terdaftar dalam format spreadsheet Excel (`.xlsx`).

---

## 4. Attendance & QR Scanner Module

- **Camera QR Scanner**: Pemindai kode QR interaktif berbasis HTML5 di browser smartphone/laptop tanpa perlu instalasi aplikasi khusus.
- **Validasi Kehadiran Real-time**: Pengecekan status pendaftaran, pencegahan scan ganda (`QR_ALREADY_USED`), validasi token tidak valid (`INVALID_QR`), dan update status pendaftar menjadi `CHECKED_IN`.
- **Scan Result Page**: Halaman ringkasan hasil scan langsung dengan umpan balik visual dan data detail peserta.

---

## 5. Certificate Builder & Automated Distribution

- **Certificate Template Builder**:
  - Pengaturan background sertifikat (Cloud Storage URL).
  - Kustomisasi tipografi (font judul, font konten, font header), skema warna teks, dan warna aksen primer.
  - Kustomisasi header text, subjudul, dan margin bawah footer.
  - Template nomor sertifikat dinamis dengan tag pengganti: `{SLUG}`, `{REG_NO}`, `{YEAR}`, `{MONTH}`, `{DAY}`, `{SEQ}`, `{RAND}`.
  - Multi E-Signatures: Unggah tanda tangan elektronik panitia/pimpinan dengan nama, gelar, dan urutan tampilan.
- **Automated Generation**:
  - Generate dan update sertifikat instan bagi peserta yang berstatus `CHECKED_IN` pada event yang selesai (`COMPLETED`).
  - Bulk synchronization sertifikat untuk seluruh event.
- **Verifikasi Publik & Unduhan**:
  - Halaman publik verifikasi sertifikat resmi di `/certificates/[id]`.
  - Unduh sertifikat format PDF langsung dari dashboard peserta atau link publik.
  - Pencatatan waktu unduhan (`download_time`).

---

## 6. Participant Experience Portal

- **Participant Dashboard**: Kartu event terdekat, status registrasi & tiket, pintasan unduh QR, dan statistik event yang diikuti.
- **Event History**: Riwayat seluruh event yang pernah didaftar lengkap dengan status kehadiran dan tombol unduh sertifikat.
- **Payment History**: Riwayat tagihan dan form unggah/perbarui bukti pembayaran.
- **User Profile**: Pengelolaan data diri, foto avatar, ubah kata sandi, dan riwayat tiket bantuan.
- **Help & Support Submission**: Form pengajuan tiket kendala langsung ke tim admin.

---

## 7. Public Experience & SEO

- **Landing Page**: Hero banner, pencarian & filter event instan, event unggulan, hitung mundur event terdekat, statistik platform, artikel terbaru, carousel testimoni peserta, grid galeri, dan subscription newsletter.
- **Catalog & Detail Event**: Informasi lengkap tanggal, lokasi/link virtual, harga tiket, profil pembicara, fasilitas peserta, dan CTA pendaftaran.
- **SEO Optimization**: Metadata otomatis, sitemap dinamis (`sitemap.tsx`), `robots.tsx`, OpenGraph image, dan pemisahan indexing rute internal.
