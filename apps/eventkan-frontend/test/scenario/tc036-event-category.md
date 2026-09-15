# Test Case: Event Category Management (TC036)

## Skenario Pengujian
Memastikan Admin dapat menambah kategori event baru.

## Prasyarat
- Admin ter-login dan berada di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/event-categories`.

## Kondisi
- **Input**: nama kategori `Artificial Intelligence`
- **Output yang Diharapkan**:
  - Kategori baru tersimpan di database.

## Langkah-Langkah Pengujian
1. Buka `/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/event-categories`.
2. Klik "+ Tambah Kategori".
3. Masukkan `Artificial Intelligence` dan klik Simpan.
4. Verifikasi kategori muncul di tabel.
