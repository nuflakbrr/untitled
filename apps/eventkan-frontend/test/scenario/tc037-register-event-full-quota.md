# Test Case: Register Event Full Quota Block (TC037)

## Skenario Pengujian
Memastikan pendaftaran event ditolak ketika kuota peserta event sudah penuh.

## Prasyarat
- Peserta terautentikasi.
- Fixture `event-kuota-penuh-e2e` berstatus aktif, kuota `1`, dan sudah memiliki satu pendaftaran aktif.

## Kondisi
- **Input**: Klik "Daftar Sekarang" pada event penuh.
- **Output yang Diharapkan**:
  - Tombol pendaftaran dinonaktifkan atau muncul pesan "Kuota event sudah penuh".

## Langkah-Langkah Pengujian
1. Masuk sebagai peserta yang belum terdaftar pada fixture tersebut.
2. Buka halaman detail event yang kuotanya habis `/events/event-kuota-penuh-e2e`.
3. Verifikasi tombol "Kuota Penuh" tampil dan tidak dapat ditekan.
