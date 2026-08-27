# Backend Feature: Pesan Dukungan & Tiket Bantuan - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Support Messages & Inquiries  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL

---

## 1. Arsitektur Data Support

- **Tabel**: `support_messages`
  - `id`: VARCHAR(36) PK
  - `name`: Nama pengirim
  - `email`: Alamat email
  - `phone`: Nomor telepon / WhatsApp
  - `title`: Topik kendala
  - `category`: Kategori kendala (`Event`, `Pembayaran & Tiket`, `Akun`, `Lainnya`)
  - `chronology`: Kronologi detail keluhan
  - `status`: `PENDING`, `PROCESS`, `RESOLVED`
  - `user_id`: VARCHAR(36) NULLable FK ke `users(id)`
  - `created_at`, `updated_at`

---

## 2. Operasi Endpoint

- `POST /features/v1/support-messages`: Submit tiket bantuan publik (Guest atau User terdaftar).
- `GET /features/v1/support-messages`: Mengambil daftar tiket bantuan (Permission: `support.read`).
- `PATCH /features/v1/support-messages/:id/status`: Mengubah status penanganan tiket (Permission: `support.update`).
