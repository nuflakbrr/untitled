# Test Case: Login Root Superadmin Success (TC001)

## Skenario Pengujian
Memastikan root superadmin seed dapat login ke dashboard tenant root menggunakan kredensial yang valid.

## Prasyarat
- Data seed backend sudah dijalankan.
- Konfigurasi `E2E_ROOT_ADMIN_EMAIL`, `E2E_PASSWORD`, dan `E2E_ROOT_TENANT_ID` tersedia.

## Kondisi
- **Input**:
  - Email: `superadmin.univ@gmail.com`
  - Password: `password`
- **Output yang Diharapkan**:
  - Pengguna dialihkan ke `/admin/{E2E_ROOT_TENANT_ID}/dashboard`.
  - Sesi login aktif terdeteksi.

## Langkah-Langkah Pengujian
1. Buka halaman login `/login`.
2. Masukkan email `peserta@gmail.com` pada input email.
3. Masukkan password `Password123` pada input password.
4. Klik tombol "Masuk".
5. Verifikasi URL saat ini adalah dashboard tenant root.
