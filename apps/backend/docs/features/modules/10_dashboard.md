# Backend Feature: Dashboard & Analitik - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Dashboard & Aggregated Analytics  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL Aggregations

---

## 1. Analitik Ringkasan (Admin Dashboard)

Endpoint `GET /features/v1/dashboard/stats` mengembalikan metrik agregasi:
- **Total Events**: Jumlah seluruh event dan perincian per status (`PUBLISHED`, `DRAFT`, `COMPLETED`).
- **Total Registrations**: Total peserta terdaftar.
- **Total Revenue**: Akumulasi nominal rupiah dari pembayaran berstatus `PAID`.
- **Attendance Rate**: Persentase peserta yang hadir (`CHECKED_IN` vs `REGISTERED`).
- **Certificates Issued**: Jumlah sertifikat digital yang berhasil digenerate.

---

## 2. Analitik Peserta (Participant Dashboard)

Endpoint `GET /features/v1/dashboard/participant-stats`:
- Event aktif yang akan datang.
- Riwayat tiket QR siap pakai.
- Sertifikat yang siap diunduh.
