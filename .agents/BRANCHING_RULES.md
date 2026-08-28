# Branching Rules

## Aturan Utama Pembuatan Branch (MANDATORY)

- **SELALU buat branch baru dari branch `main` terbaru**. Dilarang keras mencabangkan fitur dari branch kerja lain (`feat/*`, `fix/*`, dll.).
- Sebelum membuat branch kerja baru, wajib berpindah ke `main` dan tarik perubahan terbaru:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b <type>/<scope>/<short-description>
  ```
- `main` adalah branch utama (single source of truth) dan harus selalu dalam kondisi stabil.
- Jangan pernah mengembangkan fitur atau melakukan commit langsung di `main`.

## Format Nama Branch

Gunakan format berikut:

```text
<type>/<scope>/<short-description>
```

`type` yang diperbolehkan:

- `feat` — pengembangan fitur baru
- `fix` — perbaikan bug
- `hotfix` — perbaikan darurat atau kritis
- `refactor` — perubahan struktur kode
- `performance` — peningkatan performa
- `chore` — pemeliharaan atau tooling

## Requirements

- `scope` harus menunjukkan area perubahan, misalnya `be`, `fe`, `auth`, atau `event`.
- `short-description` harus singkat, menggunakan lowercase, dan memakai tanda hubung.
- Jangan memakai spasi, underscore, atau karakter khusus lain dalam nama branch.
- Satu branch harus fokus pada satu tujuan perubahan.
- Jangan menggabungkan pekerjaan yang tidak berkaitan dalam branch yang sama.

## Examples

```text
feat/be/event-module
fix/be/redis-ipv6
refactor/fe/auth-layout
performance/be/event-query
chore/repo/update-tooling
```

## Pull Request

- Push branch kerja ke remote setelah perubahan siap diverifikasi.
- Buat Pull Request menuju `main`.
- Pastikan test, lint, dan pemeriksaan terkait lulus sebelum merge.
- Jangan merge perubahan yang gagal diverifikasi.
