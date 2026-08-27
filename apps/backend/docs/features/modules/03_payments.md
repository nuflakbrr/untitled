# Backend Feature: Pembayaran & iPaymu Gateway - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Multi-Tenant Payments & iPaymu Integration  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL + iPaymu REST API v2 + Webhook Signature Verification

---

## 1. Arsitektur Multi-Credential per Tenant

1. Kredensial iPaymu (`api_key`, `virtual_account`, `env`) disimpan per fakultas di tabel `tenant_payment_gateways`.
2. Saat checkout dipicu:
   - Backend mencari `tenant_id` dari event terkait.
   - Mengambil kredensial gateway fakultas tersebut.
   - Menghasilkan signature `HMAC-SHA256` untuk request ke API iPaymu.
3. Dana transaksi masuk langsung ke saldo akun iPaymu fakultas bersangkutan dan di-*settle* otomatis ke rekening bank fakultas.

---

## 2. Alur Webhook Otomatis

1. iPaymu mengirimkan HTTP POST callback ke `POST /features/v1/payments/webhook/ipaymu`.
2. Backend memvalidasi signature callback untuk mencegah pemalsuan (*spoofing*).
3. Backend mengubah status pembayaran menjadi `PAID` dan registrasi menjadi `REGISTERED` dalam satu transaksi atomic.
4. Memicu antrean email tiket QR Code ke peserta.
