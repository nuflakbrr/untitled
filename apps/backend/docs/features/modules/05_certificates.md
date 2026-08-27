# Backend Feature: Sertifikat Digital - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Digital Certificates & Verification  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL + PDF Generation

---

## 1. Arsitektur Data Sertifikat

- **Tabel Desain Template**: `certificate_templates` (1-to-1 dengan `events`).
  - Menyimpan konfigurasi layout, tipografi (font header, title, content), warna primer, nomor template, dan latar belakang.
- **Tabel Tanda Tangan**: `certificate_signatures`
  - Nama, jabatan, url gambar tanda tangan, urutan order.
- **Tabel Sertifikat Terbit**: `certificates`
  - `id`, `registration_id`, `event_id`, `user_id`, `certificate_number` (UNIQUE), `template_url`, `pdf_url`, `download_url`, `download_time`.

---

## 2. Syarat & Otomatisasi Penerbitan

1. Event harus memiliki konfigurasi `certificate_enabled = true`.
2. Peserta harus terkonfirmasi hadir dengan status `registrations.status = 'CHECKED_IN'`.
3. Event berstatus `COMPLETED` atau dipicu sinkronisasi manual oleh panitia.
4. Generasi nomor seri sertifikat otomatis menggantikan tag `{SLUG}`, `{REG_NO}`, `{YEAR}`, `{SEQ}`, `{RAND}`.

---

## 3. Endpoint Verifikasi Publik

- **Endpoint**: `GET /features/v1/certificates/:id/verify` (atau via slug nomor sertifikat).
- Terbuka untuk umum tanpa autentikasi JWT.
- Mengembalikan metadata keabsahan: nama penerima, judul event, tanggal acara terbit, dan daftar penandatangan resmi.
