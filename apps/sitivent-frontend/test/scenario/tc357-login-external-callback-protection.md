# TC357 — Blokir Callback Login Eksternal

## Tujuan
Memastikan login tidak menjadi open redirect untuk URL pihak ketiga.

## Prasyarat
Kredensial root superadmin seed tersedia.

## Langkah
1. Buka login dengan `callbackURL` ke domain eksternal.
2. Login dengan kredensial valid.

## Hasil yang Diharapkan
Pengguna tetap berada pada origin SITIVENT dan masuk ke dashboard tenantnya.
