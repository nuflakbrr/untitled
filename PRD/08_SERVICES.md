# Service Layer Architecture - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Pedoman arsitektur Service Layer di Go Backend (`apps/backend`) dan API Client Layer di Next.js Frontend (`apps/frontend`).

---

## 1. Backend Service Layer Pattern (Go 1.25+)

Di dalam `apps/backend/internal/`, arsitektur dibagi menjadi 4 lapisan terpisah:

```text
HTTP Request
    │
    ▼
[Middleware Layer]     ── (Auth, CORS, Zap Logging, PBAC Redis Guard)
    │
    ▼
[Handler Layer]        ── (gin.Context binding, DTO parsing, validation)
    │
    ▼
[Service Layer]        ── (Domain business logic, transaction coordination)
    │
    ▼
[Repository Layer]     ── (PostgreSQL parameterized queries, sql.Tx)
    │
    ▼
PostgreSQL Database
```

### Tanggung Jawab Tiap Lapisan:

1. **Handler (`internal/handlers/`)**:
   - Membaca parameter HTTP (`c.Param`, `c.Query`, `c.ShouldBindJSON`).
   - Memanggil fungsi Service terkait.
   - Mengembalikan response menggunakan helper `pkg/response.Success(c, ...)` atau `pkg/response.Error(c, ...)`.

2. **Service (`internal/services/`)**:
   - Mengeksekusi aturan bisnis (misal: memastikan kuota event belum habis sebelum mendaftarkan peserta).
   - Menghitung total harga atau token hash.
   - Memanggil repository di dalam transaksi basis data `sql.Tx`.

3. **Repository (`internal/repositories/`)**:
   - Murni kueri SQL dengan prepared statement.
   - Menangani mapping dari SQL Rows ke struct model domain.

---

## 2. Frontend API Client Layer (`apps/frontend/src/services/`)

Frontend mengonsumsi endpoint backend REST API menggunakan wrapper **Ky** dan **TanStack React Query**:

```typescript
// Contoh implementasi di src/services/events.ts
import ky from 'ky';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Event, EventResponse } from 'src/types/event';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('accessToken');
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});

export function useGetEvents(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const res = await api.get('features/v1/events', { searchParams: params }).json<EventResponse>();
      return res.data;
    },
  });
}
```

---

## 3. Standar Error Handling & Kode Status HTTP

| HTTP Status | Kondisi Penggunaan | Response Message |
| :--- | :--- | :--- |
| **200 OK** | Kueri data sukses / pembaruan data sukses | `"Data berhasil diambil / diperbarui"` |
| **201 Created** | Data baru berhasil dibuat | `"Data berhasil dibuat"` |
| **400 Bad Request** | Validasi input DTO gagal | `"Format data tidak valid"` |
| **401 Unauthorized** | Token JWT hilang atau kadaluarsa | `"Sesi login telah berakhir"` |
| **403 Forbidden** | User tidak memiliki permission | `"Anda tidak memiliki hak akses untuk aksi ini"` |
| **404 Not Found** | Data tidak ditemukan di database | `"Data tidak ditemukan"` |
| **409 Conflict** | Duplikasi data unik (misal: slug / email sudah ada) | `"Email / Data sudah terdaftar"` |
| **500 Internal Error** | Error sistem tak terduga | `"Terjadi kesalahan pada server"` |
