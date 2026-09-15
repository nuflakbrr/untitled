# Audit Kualitas Suite E2E

## Hasil audit

- 360 scenario Markdown memiliki pasangan 360 Playwright spec dengan ID unik.
- 363 test ditemukan oleh Playwright karena beberapa spec memiliki lebih dari satu assertion flow.
- TC001–TC360 memakai fixture tenant dan kredensial yang dapat dikonfigurasi melalui `.env.e2e.local`.
- 77 spec legacy masih mengandung `expect(page).toBeDefined()` dan belum memenuhi standar assertion perilaku pengguna.

## Standar kelayakan

Test E2E baru atau yang diperbarui wajib memverifikasi paling sedikit satu hasil yang dapat dilihat pengguna: URL/redirect, heading, kontrol form, pesan validasi, perubahan data yang dapat diobservasi, atau respons keamanan. Assertion objek Playwright dan `body` saja tidak dihitung sebagai coverage fungsional.

## Prioritas penggantian legacy

1. Alur mutatif yang memerlukan fixture resettable: registrasi event, pembayaran, check-in, penghapusan, dan upload.
2. Alur yang mengklaim integrasi backend tetapi hanya membuka route: email queue, audit log, storage, dan database resiliency.
3. Alur UI yang sudah memiliki locator stabil: form event, dashboard, sertifikat, artikel, galeri, serta manajemen pengguna.

## Batasan eksekusi

Suite penuh menjalankan test yang dapat membuat atau mengubah data. Jalankan pada database E2E yang di-reset, bukan database pengembangan bersama. Test non-mutatif dapat dijalankan per file selama backend dan fixture seed tersedia.
