# Laporan Suite E2E SITIVENT

## Status Audit

| Pemeriksaan | Hasil | Bukti |
| --- | --- | --- |
| Pasangan scenario/spec | Lulus | `bun run test:validate` menemukan 360 scenario dan 360 spec tanpa ID duplikat atau pasangan hilang. |
| Discovery Playwright | Lulus | `bunx playwright test --list` menemukan 363 test dari 360 file. |
| TypeScript | Lulus | `bunx tsc --noEmit --pretty false`. |
| Lint seluruh suite | Lulus | ESLint untuk semua test case, test utility, dan konfigurasi Playwright. |
| Smoke E2E browser | Lulus | TC058 dan TC095 lulus pada Chromium. |

## Cakupan Saat Ini

- **TC001–TC100**: autentikasi, registrasi, event, pembayaran, kehadiran, sertifikat, konten, bantuan pelanggan, dan RBAC.
- **TC101–TC318**: navigasi publik, state kosong/error, batas input, accessibility, responsif, storage, dan network resilience.
- **TC319–TC340**: route admin tenant nyata, dashboard root/fakultas, recycle bin, transaksi, publikasi, sertifikat, dan form create berbasis tenant.
- **TC341–TC360**: pencarian per modul, toggle active/recycle bin, proteksi halaman peserta tanpa sesi, sanitasi callback login, dan aksesibilitas kontrol password.

## Catatan kualitas legacy

Audit menemukan 77 spec legacy dengan assertion objek Playwright yang tidak membuktikan hasil perilaku pengguna. Daftar prioritas dan standar penggantiannya terdokumentasi pada `test/TEST_AUDIT.md`; angka tersebut tidak diperlakukan sebagai coverage fungsional sampai tiap test diganti dengan assertion UI/API yang nyata.

## Temuan dan Perbaikan Audit

1. Banyak spec lama memakai route admin tanpa `tenant_id`; route produksi selalu memakai `/admin/{tenant_id}/...`.
2. Akun fixture lama tidak sesuai seeder. Fixture bersama sekarang menggunakan kredensial seed dan dapat dioverride lewat `E2E_*`.
3. Retry lokal sebelumnya dapat mengulang aksi mutatif. Retry sekarang hanya aktif pada CI.
4. Perintah test lama selalu `--headed` dan panduan masih menyebut Prisma/pnpm. Keduanya telah disesuaikan ke Bun dan backend Go.

## Ketentuan Sebelum Menjalankan Full Suite

Sebagian test lama melakukan create, delete, register, upload, atau verifikasi pembayaran. Jalankan full suite hanya terhadap database E2E yang dapat direset, bukan database kerja. Setelah database E2E tersedia, jalankan:

```bash
cd apps/sitivent-frontend
bun run test
```

Laporan HTML tersedia melalui:

```bash
bunx playwright show-report
```
