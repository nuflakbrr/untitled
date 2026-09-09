# Test Case: Admin Reply Support Message (TC049)

## Skenario Pengujian
Memastikan Admin dapat melihat dan menandai pesan bantuan pelanggan sebagai sudah dibaca / dibalas.

## Prasyarat
- Admin ter-login di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/support/messages`.

## Kondisi
- **Input**: Klik tandai dibaca pada pesan masuk.
- **Output yang Diharapkan**:
  - Status pesan berubah menjadi `READ`.

## Langkah-Langkah Pengujian
1. Buka `/admin/c9711506-d356-4704-a32e-0543dfe3e104/support/messages`.
2. Klik pesan pelanggan.
3. Tandai sebagai selesai/dibaca.
4. Verifikasi status pesan diperbarui.
