# Multi-Tenant PBAC & Authorization - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Model PBAC (*Permission-Based Access Control*) Berjenjang untuk Universitas & Fakultas dengan cache Redis di Go middleware.

---

## 1. Hierarki Role & Tenant Scoping

| Role | Scope Tenant | Deskripsi & Hak Akses |
| :--- | :--- | :--- |
| **`root_superadmin`** | Global (Rektorat) | Superadmin Universitas: Manajemen seluruh tenant fakultas, monitoring analitik lintas fakultas, switch tenant context, full platform settings. |
| **`tenant_superadmin`** | Fakultas Spesifik | Superadmin Fakultas: Manajemen panitia & scanner fakultas, pengelolaan seluruh event fakultas, verifikasi pembayaran tiket fakultas. |
| **`panitia`** | Fakultas Spesifik | Panitia Fakultas: Operasional CRUD event fakultas, pembuatan fasilitas/pembicara, manajemen peserta & absensi. |
| **`scanner`** | Fakultas Spesifik | Petugas Scanner: Pemindaian QR Code presensi pada event-event fakultas. |
| **`peserta`** | Universal | Peserta (Mahasiswa & Umum): 1 akun universal untuk mendaftar ke event fakultas manapun maupun event universitas. |

---

## 2. In-Memory Permission Cache di Redis

- **Redis Key Format**: `user_permissions:{userId}:{tenantId}`
- **TTL**: 10 menit dengan mekanisme invalidasi instan saat terjadi pembaruan hak akses.
- **Middleware Flow**:
  1. `RequireAuth()` mengekstrak JWT Claims (`user_id`, `tenant_id`, `roles`).
  2. `RequirePermission("events.create")` memeriksa izin di Redis Cache dengan batasan scope `tenant_id`.
  3. `root_superadmin` otomatis memiliki hak bypass ke seluruh tenant.
