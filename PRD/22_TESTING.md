# Testing & Quality Assurance - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Strategi pengujian otomatis untuk Go Backend dan Next.js Frontend.

---

## 1. Backend Testing (Go 1.25+)

Pengujian backend mencakup unit testing logika domain dan integration testing endpoint HTTP Gin:

```bash
# Menjalankan seluruh unit test di backend
make test
# atau langsung di direktori backend:
cd apps/backend && go test -v -race ./...
```

### Pola Pengujian Backend:
- **Handler Test**: Menggunakan `net/http/httptest` dan `gin.CreateTestContext` untuk menguji response code dan format JSON envelope.
- **Service Test**: Pengujian aturan bisnis dengan mock repository.
- **Repository / Database Test**: Menggunakan test container / test PostgreSQL database sementara.

---

## 2. Frontend Testing (Next.js 16)

- **Type Checking**:
  ```bash
  make tsc
  ```
- **Linting & Code Formatting**:
  ```bash
  make lint
  ```
- **End-to-End (E2E) Testing**:
  Menggunakan Playwright untuk memvalidasi alur pengguna nyata (Pendaftaran event, Login, Admin Dashboard, Pemindaian QR).

---

## 3. Git Hooks & Automated Quality Gate (Husky)

1. **Pre-commit**: Menjalankan `bunx lint-staged` untuk memastikan formatting Prettier dan linting ESLint lolos pada berkas yang di-stage.
2. **Pre-push**: Menjalankan `bun run tsc:check` (via Turborepo) untuk menjamin tidak ada error tipe data TypeScript di seluruh aplikasi sebelum kode di-push ke repository remote.
