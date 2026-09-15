# Test Case: Login Failed due to Invalid Credentials (TC003)

## Skenario Pengujian
Memastikan sistem memvalidasi dan menolak upaya login jika password yang dimasukkan salah, serta menampilkan pesan error yang relevan.

## Prasyarat
- Akun seed terdaftar dengan email `peserta@gmail.com` dan password `password`.

## Kondisi
- **Input**:
  - Email: `peserta@gmail.com`
  - Password: `wrongpassword`
- **Output yang Diharapkan**:
  - Upaya login ditolak.
  - Halaman tetap di `/login`.
  - Pesan error `Email atau password salah.` ditampilkan.

## Langkah-Langkah Pengujian
1. Buka halaman login `/login`.
2. Masukkan email `peserta@gmail.com` pada input email.
3. Masukkan password `PasswordSalah` pada input password.
4. Klik tombol "Masuk".
5. Verifikasi URL saat ini tetap `/login`.
6. Verifikasi munculnya pesan notifikasi error / toast error.
