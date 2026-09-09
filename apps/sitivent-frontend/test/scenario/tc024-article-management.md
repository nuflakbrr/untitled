# Test Case: Article Management (TC024)

## Skenario Pengujian
Memastikan Admin dapat membuat artikel edukasi baru.

## Prasyarat
- Admin ter-login dan berada di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/publications/articles`.

## Kondisi
- **Input**:
  - Judul: `Tips Sukses Mengikuti Bootcamp 2026`
  - Kategori: `Teknologi`
  - Konten: `Berikut adalah tips persiapan sebelum mengikuti bootcamp...`
- **Output yang Diharapkan**:
  - Artikel berhasil dibuat dan tampil di daftar artikel.

## Langkah-Langkah Pengujian
1. Buka `/admin/c9711506-d356-4704-a32e-0543dfe3e104/publications/articles`.
2. Klik tombol "+ Tambah Artikel".
3. Isi formulir artikel (judul, kategori, konten).
4. Klik tombol "Simpan".
5. Verifikasi artikel baru berada dalam tabel publikasi artikel.
