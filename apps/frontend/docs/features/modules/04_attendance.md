# Frontend Feature: QR Scanner & Presensi - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Camera QR Scanner UI  
> **Stack**: Next.js 16 + `html5-qrcode` + Material UI v9

---

## 1. Implementasi Pemindai Kamera (`src/sections/scanner/`)

- Menggunakan library `html5-qrcode` dengan dynamic import (`ssr: false`) untuk mengakses kamera perangkat secara langsung di browser.
- Pilihan penggantian kamera depan/belakang dan aktivasi flash kamera (jika didukung perangkat).

---

## 2. Alur Feedback Real-Time

1. Scanner memindai barcode QR tiket peserta $\rightarrow$ Mengekstrak string `qr_token`.
2. Mengirim request `POST /features/v1/attendances/scan`.
3. Menampilkan modal hasil scan instan:
   - **Sukses**: Kartu hijau dengan nama peserta, nomor tiket, dan status hadir.
   - **Gagal / Sudah Digunakan**: Kartu merah/kuning dengan suara peringatan dan waktu check-in sebelumnya.
