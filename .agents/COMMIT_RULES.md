# Commit Rules

Gunakan format commit berikut:

```text
[type](scope): message
```

## Allowed Types

`type` wajib salah satu dari:

- `fix` — memperbaiki bug
- `chore` — perubahan pemeliharaan atau tooling
- `feat` — menambahkan fitur
- `hotfix` — perbaikan darurat atau kritis
- `refactor` — perubahan struktur tanpa mengubah perilaku
- `performance` — peningkatan performa

## Requirements

- `scope` harus menjelaskan area perubahan, misalnya `event`, `auth`, atau `redis`.
- `message` harus singkat, jelas, menggunakan bahasa Inggris, dan tanpa titik di akhir.
- Jangan menambahkan atribusi AI atau `Co-Authored-By`.

## Examples

```text
feat(event): add event category CRUD
fix(redis): support IPv6 host addresses
refactor(auth): simplify tenant scope resolution
```
