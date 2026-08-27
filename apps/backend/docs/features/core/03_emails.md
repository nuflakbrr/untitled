# Backend Feature: Antrean Email Asinkron - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Asynchronous Email Queue  
> **Stack**: Go 1.25+ (`net/smtp`) + PostgreSQL (`email_queues`) + Goroutine Worker

---

## 1. Arsitektur Antrean Email

- **Tabel**: `email_queues` (`id`, `to`, `subject`, `body`, `attachments`, `status`, `attempts`, `error`, `created_at`, `updated_at`).
- **Worker**: Berjalan di latar belakang menggunakan Go Ticker (interval 5 detik) untuk memproses email berstatus `PENDING`.
- **Maksimal Percobaan**: 3 kali percobaan sebelum status berubah menjadi `FAILED`.

---

## 2. Template Email (`pkg/email/templates/`)

- `welcome.html`: Email sambutan setelah pendaftaran akun.
- `verify_email.html`: Email tautan aktivasi akun.
- `reset_password.html`: Email token reset password.
- `ticket_confirmation.html`: Email konfirmasi tiket dan barcode QR.
