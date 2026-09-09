# Panduan Eksekusi E2E SITIVENT

Suite ini memakai Playwright dan TypeScript untuk menguji route publik, autentikasi, dashboard peserta, serta modul admin berbasis tenant.

## Prasyarat

- Bun dan dependensi frontend telah diinstal dengan `bun install`.
- PostgreSQL serta backend berjalan.
- Database backend dimigrasikan dan di-seed melalui `make db-setup` dari `apps/sitivent-backend`.
- Browser Chromium Playwright tersedia: `bunx playwright install chromium`.

## Konfigurasi Fixture

Default suite memakai data seed backend. Jika fixture lokal berbeda, salin `.env.e2e.example` menjadi `.env.e2e.local`, lalu isi variabel `E2E_*`. Jangan menyimpan kredensial non-development dalam berkas tersebut.

Konfigurasi penting:

- `E2E_BASE_URL` — alamat frontend, default `http://localhost:3000`.
- `E2E_ROOT_TENANT_ID` dan `E2E_FACULTY_TENANT_ID` — tenant untuk route admin.
- `E2E_ROOT_ADMIN_EMAIL`, `E2E_FACULTY_ADMIN_EMAIL`, dan `E2E_PASSWORD` — akun fixture.

## Menjalankan Pengujian

Jalankan frontend dan backend dari root monorepo:

```bash
make dev
```

Validasi pasangan scenario/spec terlebih dahulu:

```bash
cd apps/sitivent-frontend
bun run test:validate
```

Jalankan seluruh suite TC001–TC360:

```bash
bun run test
```

Jalankan satu spec atau mode browser terlihat:

```bash
bunx playwright test test/test-case/tc319-root-dashboard-route.spec.ts
bun run test:headed
```

Verifikasi tipe dan lint test yang diubah:

```bash
bunx tsc --noEmit
bunx eslint --no-cache test/test-case/**/*.spec.ts
```

## Struktur

```
test/
├── .env.e2e.example          # Konfigurasi fixture development
├── HOW_TO_TEST.md            # Panduan eksekusi
├── RESULT_TEST.md            # Pemetaan scenario dan spec
├── scenario/                 # TC001–TC360 dalam Markdown
├── test-case/                # TC001–TC360 Playwright specs
├── utils/                    # Auth dan route fixture bersama
└── validate-test-suite.mjs   # Menjamin pasangan ID scenario/spec
```

## Catatan Eksekusi

`bun run test:validate` hanya memeriksa struktur suite. Status perilaku aplikasi ditentukan oleh hasil Playwright terhadap backend, database, dan fixture yang benar-benar aktif. Playwright menghasilkan HTML report yang dapat dibuka dengan `bunx playwright show-report`.
