# Backend Feature: Presensi & QR Scanner - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Attendance & Live QR Scanning  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL Atomic Updates

---

## 1. Arsitektur Data Kehadiran

- **Tabel Utama**: `attendances`
  - `id`: VARCHAR(36) PK
  - `registration_id`: VARCHAR(36) UNIQUE FK ke `registrations(id)`
  - `scan_time`: TIMESTAMPTZ NOT NULL DEFAULT NOW()
  - `scanner_id`: VARCHAR(36) FK ke `users(id)` petugas
  - `status`: `SUCCESS`, `FAILED`

---

## 2. Alur Kerja Validasi Scan QR

1. **Endpoint**: `POST /features/v1/attendances/scan`
2. **Payload**: `{ "qr_token": "string", "event_id": "string" }`
3. **Logika Eksekusi**:
   - Cari data registrasi berdasarkan `qr_token` dan `event_id`.
   - Validasi:
     - Jika tidak ditemukan $\rightarrow$ Return `404 Not Found`.
     - Jika status bukan `REGISTERED` (misal `WAITING_PAYMENT` / `CANCELLED`) $\rightarrow$ Return `400 Bad Request`.
     - Jika sudah `CHECKED_IN` $\rightarrow$ Return `409 Conflict` ("Peserta sudah pernah check-in").
   - Jika valid:
     - Update `registrations.status = 'CHECKED_IN'`.
     - Insert ke tabel `attendances` (`status = 'SUCCESS'`, `scanner_id = Context.UserID`).
     - Return `200 OK` memuat profil peserta & waktu check-in.
