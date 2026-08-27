# Backend Feature: Testimoni & Rating - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Testimonials & Ratings  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL

---

## 1. Arsitektur Data Testimoni

- **Tabel**: `testimonials`
  - `id`: VARCHAR(36) PK
  - `registration_id`: VARCHAR(36) UNIQUE FK ke `registrations(id)`
  - `event_id`: VARCHAR(36) FK ke `events(id)`
  - `user_id`: VARCHAR(36) FK ke `users(id)`
  - `rating`: INTEGER (1 s/d 5)
  - `comment`: TEXT ulasan peserta
  - `created_at`, `updated_at`

---

## 2. Validasi & Ketentuan

1. Hanya peserta yang telah terdaftar dan berstatus `CHECKED_IN` yang dapat memberikan ulasan.
2. Rating bernilai antara 1 sampai dengan 5 bintang.
3. Satu registrasi hanya dapat memberikan maksimal satu kali ulasan.
