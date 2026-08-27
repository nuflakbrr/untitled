# Frontend Feature: Pendaftaran & Pembayaran - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Registrations & Payments UI  
> **Stack**: Next.js 16 (React 19) + Material UI v9 + TanStack Query

---

## 1. Alur Pendaftaran Peserta

1. Peserta memilih event dan menekan tombol **Daftar Sekarang**.
2. Form memvalidasi kehadiran (Online/Offline) dan konfirmasi identitas.
3. Mengirim mutasi TanStack Query `POST /features/v1/registrations`.
4. Jika event gratis $\rightarrow$ Redirect langsung ke tiket QR di Dashboard Peserta.
5. Jika event berbayar $\rightarrow$ Redirect ke halaman instruksi transfer pembayaran.

---

## 2. Unggah & Verifikasi Bukti Transfer

1. **Peserta (`src/sections/participant/payment/`)**:
   - Menampilkan nomor rekening tujuan transfer dan total tagihan.
   - Form upload file gambar bukti transfer (JPG/PNG $\le$ 5MB).
   - Mengirim mutasi `POST /features/v1/payments/proof`.
2. **Panitia (`src/sections/admin/payments/`)**:
   - Pratinjau bukti transfer dalam modal fullscreen lightbox.
   - Tombol aksi: **Setujui Pembayaran** (`PAID`) atau **Tolak** (`FAILED` + alasan penolakan).
