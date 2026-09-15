# Test Case: Edit Event Details (TC034)

## Skenario Pengujian
Memastikan Admin dapat memperbarui rincian data event yang sudah ada.

## Prasyarat
- Admin ter-login dan berada di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/events`.

## Kondisi
- **Input**: Ubah judul event menjadi `Workshop UI/UX Update`
- **Output yang Diharapkan**:
  - Judul event berhasil diperbarui di database dan tabel UI.

## Langkah-Langkah Pengujian
1. Buka `/admin/c9711506-d356-4704-a32e-0543dfe3e104/master/events`.
2. Klik tombol Edit pada event.
3. Ubah judul event dan klik Simpan.
4. Verifikasi perubahan judul event.
