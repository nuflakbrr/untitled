# TC358 — Blokir Callback Login Protocol-Relative

## Tujuan
Memastikan bentuk `//domain` juga tidak dapat digunakan sebagai open redirect.

## Prasyarat
Kredensial root superadmin seed tersedia.

## Langkah
1. Buka login dengan `redirectTo=//domain-eksternal`.
2. Login dengan kredensial valid.

## Hasil yang Diharapkan
Pengguna masuk ke dashboard tenant, bukan domain eksternal.
