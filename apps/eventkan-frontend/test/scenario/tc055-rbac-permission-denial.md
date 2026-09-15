# Test Case: RBAC Permission Denial (TC055)

## Skenario Pengujian
Memastikan pengguna tanpa hak akses permission (misal `user.create`) ditolak saat mengeksekusi tindakan administratif.

## Prasyarat
- Pengguna login sebagai `Panitia` tanpa izin `user.create`.

## Kondisi
- **Input**: Eksekusi tindakan tambah pengguna di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/managements/users`.
- **Output yang Diharapkan**:
  - Ditolak dengan pesan "Anda tidak memiliki hak akses untuk melakukan tindakan ini."

## Langkah-Langkah Pengujian
1. Login dengan akun tanpa izin `user.create`.
2. Akses halaman manajemen pengguna.
3. Verifikasi pesan penolakan akses.
