# Model distribusi SITIVENT

Panduan menjaga distribusi dan deployment aplikasi SITIVENT.

## Peta branch (repo ini)

| Branch | Peran |
|---|---|
| `production` | versi production SITIVENT |
| `staging` | validasi perubahan sebelum dirilis ke production |

Perubahan fitur dan perbaikan dikembangkan melalui branch kerja, lalu digabungkan
ke `staging` untuk diuji sebelum dirilis ke `production`.

## Menyiapkan deployment SITIVENT

1. Buat branch kerja dari `staging` atau branch release yang ditentukan tim.
2. Jalankan checklist [branding.md](branding.md) untuk memeriksa env, logo,
   palette, font, copy, dan navigasi.
3. Daftarkan pipeline Jenkins sesuai environment deployment.

## Alur rilis

```sh
# di repository SITIVENT
git checkout staging
git pull --ff-only
git log --oneline staging
```

Commit sebaiknya tetap atomik dan mengikuti Conventional Commits agar mudah
ditinjau, dirilis, atau dibatalkan bila diperlukan.

## Yang TIDAK ikut mengalir

- `.env` / `.env.prod` — selalu lokal per-deploy (gitignored).
- Konten dan branding tetap dikelola di repository SITIVENT sesuai kebutuhan
  produk.
