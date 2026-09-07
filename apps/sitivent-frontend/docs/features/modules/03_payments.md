# Frontend Feature: Pembayaran & iPaymu Gateway - SITIVENT

> **Version**: 1.0.0  
> **Module**: Payments UI & iPaymu Multi-Tenant Integration  
> **Stack**: Next.js 16 (React 19) + Material UI v9 + TanStack Query

---

## 1. Halaman Pembayaran Peserta (`src/sections/participant/payment/`)

- **Komponen Selector Metode Bayar**:
  - **QRIS**: Menampilkan gambar QR Code secara langsung di layar dengan countdown timer pembayaran (15 menit).
  - **Virtual Account (BCA, Mandiri, BNI, BRI, BSI)**: Menampilkan nomor VA dengan tombol *Copy to Clipboard* dan panduan cara bayar ATM / Mobile Banking.
  - **E-Wallet & Retail**: Tombol redirect ke aplikasi e-wallet atau kode bayar kasir Indomaret/Alfamart.
  - **Transfer Manual**: Menampilkan nomor rekening kas fakultas penyelenggara event dengan form upload bukti transfer.
- **Auto-Refresh / Polling**:
  - Menggunakan TanStack Query `refetchInterval` saat menunggu status pembayaran berubah menjadi `PAID` via webhook.

---

## 2. Pengaturan Pembayaran Fakultas (`src/sections/admin/settings/payment/`)

- Panel konfigurasi bagi Superadmin Fakultas:
  - Input API Key dan Virtual Account Number iPaymu milik fakultas.
  - Switch mode Sandbox / Production.
  - Form input rekening bank kas resmi fakultas untuk metode transfer manual.
