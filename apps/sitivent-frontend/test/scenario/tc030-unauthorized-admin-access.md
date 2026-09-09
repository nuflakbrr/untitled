# Test Case: Unauthorized Admin Access (TC030)

## Skenario Pengujian
Memastikan pengguna biasa (Peserta) atau tamu yang belum login tidak dapat mengakses halaman Admin Dashboard.

## Prasyarat
- Pengguna login sebagai `Peserta` atau belum login.

## Kondisi
- **Input**: Navigasi ke `/admin/c9711506-d356-4704-a32e-0543dfe3e104/dashboard`
- **Output yang Diharapkan**:
  - Akses ditolak dan dialihkan ke `/login` atau `/403`.

## Langkah-Langkah Pengujian
1. Buka URL `/admin/c9711506-d356-4704-a32e-0543dfe3e104/dashboard`.
2. Verifikasi sistem melakukan redirect ke `/login` atau menampilkan halaman Forbidden.
