# Branching Rules

## Branch Utama

- `main` adalah branch utama dan harus selalu dalam kondisi stabil.
- Jangan mengembangkan fitur langsung di `main`.
- Branch kerja harus dibuat dari `main` terbaru.

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
