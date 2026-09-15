# Test Case: Certificate Template Creation (TC027)

## Skenario Pengujian
Memastikan Admin dapat mendesain dan mengonfigurasi template sertifikat digital event.

## Prasyarat
- Admin ter-login dan berada di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/certificates`.

## Kondisi
- **Input**:
  - Event: `Seminar AI`
  - Gambar Latar Template: File gambar template sertifikat
  - Posisi Teks: Posisi X/Y nama peserta
- **Output yang Diharapkan**:
  - Template sertifikat tersimpan dan siap digunakan untuk pencetakan sertifikat digital peserta.

## Langkah-Langkah Pengujian
1. Buka `/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/certificates`.
2. Klik "+ Buat Template Baru" atau "Atur Template".
3. Unggah latar belakang sertifikat dan atur bidang posisi nama peserta.
4. Klik tombol "Simpan Template".
5. Verifikasi template sertifikat tersimpan dengan sukses.
