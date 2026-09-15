# Test Case: Admin Manual Scanner (TC044)

## Skenario Pengujian
Memastikan Admin / Panitia dapat memindai QR code tiket peserta menggunakan scanner kamera di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/attendance/scan`.

## Prasyarat
- Panitia ter-login di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/attendance/scan`.

## Kondisi
- **Input**: Kode QR / Token pendaftaran valid.
- **Output yang Diharapkan**:
  - Halaman hasil presensi sukses menampilkan nama peserta dan event.

## Langkah-Langkah Pengujian
1. Buka `/admin/c9711506-d356-4704-a32e-0543dfe3e104/attendance/scan`.
2. Pindai atau masukkan token tiket.
3. Verifikasi munculnya kartu hasil presensi sukses.
