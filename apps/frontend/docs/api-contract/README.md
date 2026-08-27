# Frontend API Contract & Client Integration

> Panduan integrasi HTTP Client (`ky`) dan TanStack React Query di aplikasi Frontend Next.js.

---

## 1. Konfigurasi Client (`src/lib/ky.ts`)

- **Base URL**: `process.env.NEXT_PUBLIC_API_URL` (default: `http://localhost:8080`)
- **Headers Otomatis**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>` (diekstrak dari token storage)

---

## 2. Struktur Modul API

- **Core Module (`/core/v1/`)**:
  - `auth`: Sign in, sign up, refresh token, forgot password, reset password.
  - `user`: Profil user, CRUD pengguna, assign role, status banned.
  - `role`: Master roles dan permission checklist.
- **Features Module (`/features/v1/`)**:
  - `events`: Event catalog, detail, form CRUD event admin, benefits, speakers.
  - `registrations`: Pendaftaran event, nomor registrasi, tiket QR code.
  - `payments`: Upload bukti transfer, verifikasi pembayaran admin.
  - `attendance`: Scanner kamera check-in, riwayat presensi.
  - `certificates`: Builder template, penerbitan sertifikat, verifikasi publik.
  - `articles`: Publikasi berita, tips, many-to-many kategori artikel.
  - `galleries`: Foto dokumentasi acara dan featured carousel.
  - `testimonials`: Ulasan rating 1-5 bintang peserta hadir.
  - `support`: Form kontak bantuan dan penanganan tiket keluhan.
  - `uploads`: Upload file multipart (Cloud Storage).
  - `dashboard`: Statistik metrik admin dan peserta.
