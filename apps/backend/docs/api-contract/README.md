# SITIVENT API Contract Documentation

> **Version:** 1.0.0  
> **Target Domain:** Sistem Informasi & Manajemen Event Universitas (Hierarchical Multi-Tenant: Rektorat & Fakultas)  
> **Base URL:** `http://localhost:8080` (Development)

---

## 📚 Struktur Modul API

```text
docs/api-contract/
├── README.md
├── core/
│   ├── 01_auth.md               # Autentikasi JWT, Signin, Signup Universal, Refresh
│   ├── 02_user.md               # Manajemen Pengguna & Ban
│   ├── 03_role.md               # Role & Permission Matrix
│   ├── 04_audit-logs.md         # Audit Trail Perubahan Sensitif
│   └── 05_tenant.md             # Manajemen Tenant Universitas & Fakultas
│
└── modules/
    ├── 01_events.md             # Event Catalog, Detail, & Form CRUD Fakultas
    ├── 02_registrations.md      # Pendaftaran Universal & Tiket QR
    ├── 03_attendance.md         # Scan Presensi Kamera Real-Time
    └── 04_certificates.md       # Template Builder, E-Signatures, & Verifikasi Publik
```

---

## 🔐 Standar Header & Response Envelope

### Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- `X-Tenant-ID: <TENANT_UUID>` (Opsional / untuk context switching)

### Standard Response Envelope:
```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```
