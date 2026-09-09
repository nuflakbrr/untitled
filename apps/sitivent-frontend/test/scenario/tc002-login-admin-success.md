# Test Case: Login Faculty Superadmin Success (TC002)

## Skenario Pengujian
Memastikan superadmin fakultas seed diarahkan ke dashboard tenant fakultasnya sendiri.

## Prasyarat
- Data seed backend sudah dijalankan.
- Konfigurasi `E2E_FACULTY_ADMIN_EMAIL`, `E2E_PASSWORD`, dan `E2E_FACULTY_TENANT_ID` tersedia.

## Hasil yang Diharapkan
- Login berhasil.
- URL akhir adalah `/admin/{E2E_FACULTY_TENANT_ID}/dashboard`.

## Skenario Pengujian
Memastikan administrator (Admin/Superadmin) dapat login ke dashboard admin menggunakan email dan password yang valid.

## Prasyarat
- Akun administrator dengan email `admin@gmail.com` dan password `Password123` sudah terdaftar dengan role `Admin`.

## Kondisi
- **Input**:
  - Email: `admin@gmail.com`
  - Password: `Password123`
- **Output yang Diharapkan**:
  - Pengguna dialihkan ke halaman dashboard admin `/admin/c9711506-d356-4704-a32e-0543dfe3e104/dashboard`.
  - Sidebar menu admin (seperti Event, Registrasi, Pembayaran) terlihat.

## Langkah-Langkah Pengujian
1. Buka halaman login `/login`.
2. Masukkan email `admin@gmail.com` pada input email.
3. Masukkan password `Password123` pada input password.
4. Klik tombol "Masuk".
5. Verifikasi URL saat ini adalah `/admin/c9711506-d356-4704-a32e-0543dfe3e104/dashboard`.
6. Verifikasi sidebar navigasi admin terlihat di layar.
