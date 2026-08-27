# Core Modules & Features - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> SITIVENT terdiri dari kumpulan modul terpadu yang dirancang untuk mendukung operasional event dari hulu ke hilir dalam arsitektur **Hierarchical Multi-Tenant** (Rektorat Universitas & Fakultas).

---

## 1. Multi-Tenant Organization & PBAC

- **Hierarchical Tenant Model**:
  - **Root Tenant (Rektorat / Universitas)**: Pengawasan global lintas fakultas, manajemen data master tenant fakultas, dan event skala universitas.
  - **Child Tenants (Fakultas / Unit Kerja)**: Ruang kerja terisolasi untuk masing-masing fakultas (Fasilkom, Teknik, FEB, dll.).
  - **Tenant Switcher**: Kemampuan bagi Superadmin Universitas untuk beralih konteks antar-fakultas secara instan di dashboard.
- **Akun & Otorisasi Bertingkat**:
  - 1 Akun **Superadmin Universitas (Rektorat)**.
  - 1 Akun **Superadmin Fakultas** per tenant fakultas.
  - Akun **Panitia** dan **Scanner** terafiliasi dengan fakultas masing-masing.
  - Akun **Peserta (Universal)**: Mahasiswa dan peserta umum memiliki 1 akun untuk mendaftar ke seluruh event di berbagai fakultas maupun universitas.

---

## 2. Admin CMS Management & Master Data

- **Analytics Dashboard**:
  - Statistik agregasi global universitas (khusus Rektorat) atau statistik terisolasi per fakultas.
  - Metrik: Total Event, Pendaftar, Total Omzet Finansial, Persentase Kehadiran, dan Sertifikat Terbit.
- **Tenant Management (Khusus Rektorat)**:
  - CRUD fakultas, kustomisasi kode singkatan, domain/subdomain, logo, dan profil dekanat.
- **Event Categories**:
  - Kategori global universitas (Seminar, Workshop, Webinar, dll.) dan kategori kustom spesifik fakultas.
- **Event Master per Fakultas**:
  - Pengaturan event `ONLINE` dan `OFFLINE`, lokasi fisik aula fakultas, link meeting virtual (Zoom/GMeet), dan flag `onlineAttendance`.
  - Multi-Speaker (nama, titel, instansi/perusahaan, media sosial, avatar).
  - Event Benefits (daftar fasilitas & sertifikat).
  - Pengaturan kuota pendaftar, harga tiket (gratis / berbayar), dan batas deadline pendaftaran.
  - Siklus status: `DRAFT` ➔ `PUBLISHED` ➔ `CLOSED` ➔ `COMPLETED`.
- **Galleries & Publications (Articles)**:
  - Publikasi berita kampus, tips akademik, dan dokumentasi foto kegiatan per tenant fakultas / universitas.
- **Support Inquiries**:
  - Tiket pesan bantuan dan kendala pendaftaran yang ditangani panitia fakultas atau admin universitas.

---

## 3. Transaction & Registration Engine (Universal)

- **Pendaftaran Peserta**:
  - Mahasiswa / peserta umum dapat mendaftar ke event fakultas manapun tanpa perlu membuat akun baru.
  - Validasi kuota transaksional dengan database row locking (`FOR UPDATE`) guna mencegah *race condition*.
  - Generasi otomatis **Nomor Registrasi** unik (`REG-{SLUG}-{YEAR}-{COUNTER}`) dan **QR Token** kriptografis.
  - Auto-approval untuk event gratis (`price = 0` ➔ status `REGISTERED`).
- **Verifikasi Pembayaran Manual**:
  - Peserta mengunggah foto bukti transfer manual ke rekening panitia fakultas.
  - Panitia fakultas memverifikasi keabsahan pembayaran (`PAID` ➔ tiket QR aktif).
  - Pencatatan riwayat audit log atas setiap tindakan verifikasi.
- **Ekspor Data**: Ekspor spreadsheet Excel (`.xlsx`) data peserta per event.

---

## 4. Attendance & QR Scanner Module

- **Camera QR Scanner**: Pemindai kamera HTML5 langsung dari browser petugas scanner di gerbang aula fakultas.
- **Validasi Kehadiran Real-Time**:
  - Verifikasi kepemilikan tiket terhadap event fakultas yang sedang berlangsung.
  - Pencegahan double check-in (`QR_ALREADY_USED`).
  - Update status peserta menjadi `CHECKED_IN` secara atomik.

---

## 5. Certificate Builder & E-Signatures

- **Visual Template Builder**:
  - Desain latar belakang sertifikat khusus fakultas / rektorat.
  - Multi E-Signature resmi: Tanda tangan digital Dekan, Rektor, atau Ketua Pelaksana.
  - Penomoran seri dinamis (`CERT/{FAKULTAS}/{YEAR}/{SEQ}`).
- **Otomatisasi & Verifikasi Publik**:
  - Generate otomatis e-sertifikat PDF untuk peserta yang berstatus `CHECKED_IN` saat event `COMPLETED`.
  - Halaman verifikasi keaslian sertifikat publik (`/certificates/[id]`).

---

## 6. Participant Experience & Public Experience

- **Portal Mahasiswa & Peserta**: Dashboard event terdekat, tiket barcode QR interaktif, riwayat pembayaran, dan unduh sertifikat resmi.
- **Katalog Publik Terpadu**: Beranda utama universitas dengan filter instan per fakultas, kategori, tanggal, dan format online/offline.
