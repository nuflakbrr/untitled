# Frontend Feature: Dashboard & Visualisasi Analitik UI - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Analytics Dashboard & Metrics UI  
> **Stack**: Next.js 16 + Material UI v9 + ApexCharts / Recharts

---

## 1. Dashboard Admin CMS (`src/sections/admin/dashboard/`)

- **Metric Cards**: Ringkasan Total Event, Total Registrasi, Omzet Pembayaran, Kehadiran, dan Sertifikat.
- **Chart Grafik Interaktif**:
  - Tren pendaftaran mingguan / bulanan.
  - Diagram lingkaran proporsi kehadiran (Online vs Offline).
  - Event terpopuler berdasarkan jumlah pendaftar.

---

## 2. Dashboard Peserta (`src/sections/participant/dashboard/`)

- Kartu event terdekat yang akan dihadiri dengan hitung mundur (*countdown timer*).
- Pintasan cepat tiket QR dan status pembayaran.
- Riwayat perolehan e-sertifikat resmi.
