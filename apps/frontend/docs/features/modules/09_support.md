# Frontend Feature: Pusat Bantuan & Tiket Kendala UI - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Support Center & Inquiry Management UI  
> **Stack**: Next.js 16 + React Hook Form + Zod + Material UI v9

---

## 1. Form Bantuan Publik (`src/app/(root)/contact/page.tsx`)

- Form kontak interaktif: Nama, Email, Nomor WhatsApp, Topik Kendala, Kategori (`Event`, `Pembayaran`, `Akun`, `Lainnya`), dan Kronologi.
- Validasi Zod di sisi browser sebelum submit ke backend `POST /features/v1/support-messages`.
- Notifikasi feedback instan menggunakan Toast notification.

---

## 2. Panel Admin Support (`src/sections/admin/support/`)

- Daftar tiket kendala dengan status badge (`PENDING`, `PROCESS`, `RESOLVED`).
- Modal detail kronologi dan tombol mutasi status tiket.
