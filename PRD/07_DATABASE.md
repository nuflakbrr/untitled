# Database Conventions & Migrations - SITIVENT (Untitled Monorepo)

> **Version**: 1.1.0  
> Konvensi skema PostgreSQL, Isolasi Schema (`core` & `public`), Hierarchical Multi-Tenancy (`core.tenants`), Pure UUID v4 Primary Keys, aturan granular `golang-migrate` (1 tabel per migrasi), dan SQL seeders idempotent.

---

## 1. Konvensi Skema PostgreSQL

1. **Isolasi Schema (Core vs Public)**:
   - **Schema `core`**: Memuat seluruh entitas master sistem dan otentikasi (`core.tenants`, `core.users`, `core.sessions`, `core.accounts`, `core.verifications`, `core.roles`, `core.permissions`, `core.role_has_permissions`, `core.audit_logs`, `core.email_queues`, `core._role_to_user`).
   - **Schema `public`**: Memuat seluruh entitas fitur/domain event kampus (`events`, `event_categories`, `registrations`, `payments`, `certificate_templates`, `articles`, `galleries`, `tenant_payment_gateways`, dll.).
   - **Search Path**: DSN koneksi PostgreSQL backend menyertakan `search_path=public,core`.
2. **Identifier Unik (Primary Key)**: Seluruh tabel wajib menggunakan `VARCHAR(36)` dengan format UUID v4 murni dan nilai _default_ `gen_random_uuid()::text`.
3. **Multi-Tenant Scoping**:
   - Seluruh tabel domain event memiliki foreign key `tenant_id VARCHAR(36) REFERENCES core.tenants(id) ON DELETE CASCADE`.
   - Tabel `core.users` memiliki foreign key `tenant_id VARCHAR(36) REFERENCES core.tenants(id) ON DELETE SET NULL` untuk mengikat panitia/admin ke fakultasnya (NULL untuk peserta umum/universal).
4. **Audit Columns**: Setiap tabel utama wajib menyertakan:
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - `deleted_at TIMESTAMPTZ` (untuk soft delete)

---

## 2. Struktur Tabel Multi-Tenant (`core.tenants`)

```sql
CREATE SCHEMA IF NOT EXISTS core;

CREATE TYPE core.tenant_type AS ENUM ('ROOT', 'FACULTY', 'DEPARTMENT', 'UNIT');

CREATE TABLE core.tenants (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    type core.tenant_type NOT NULL DEFAULT 'FACULTY',
    parent_id VARCHAR(36) REFERENCES core.tenants(id) ON DELETE SET NULL,
    logo_url TEXT,
    website VARCHAR(255),
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

---

## 3. Daftar File Migrasi (`apps/backend/internal/database/migrations/`)

### A. Core Migrations (`migrations/core/`) -> Schema `core`

1. `000001_create_tenants_table` (`core.tenants`)
2. `000002_create_users_table` (`core.users`)
3. `000003_create_sessions_table` (`core.sessions`)
4. `000004_create_accounts_table` (`core.accounts`)
5. `000005_create_verifications_table` (`core.verifications`)
6. `000006_create_roles_table` (`core.roles`)
7. `000007_create_permissions_table` (`core.permissions`)
8. `000008_create_role_has_permissions_table` (`core.role_has_permissions`)
9. `000009_create_audit_logs_table` (`core.audit_logs`)
10. `000010_create_email_queues_table` (`core.email_queues`)
11. `000011_create_role_to_user_table` (`core._role_to_user`)

### B. Feature Migrations (`migrations/features/`) -> Schema `public`

1. `000001_create_event_categories_table` (with `core.tenants(id)`)
2. `000002_create_events_table` (with `core.tenants(id)`)
3. `000003_create_event_benefits_table`
4. `000004_create_event_speakers_table`
5. `000005_create_registrations_table` (with `core.users(id)`)
6. `000006_create_payments_table` (with iPaymu provider & `core.users(id)`)
7. `000007_create_certificate_templates_table` (with `core.tenants(id)`)
8. `000008_create_certificate_signatures_table`
9. `000009_create_certificates_table` (with `core.users(id)`)
10. `000010_create_attendances_table` (with `core.users(id)`)
11. `000011_create_testimonials_table` (with `core.users(id)`)
12. `000012_create_article_categories_table`
13. `000013_create_articles_table` (with `core.tenants(id)` & `core.users(id)`)
14. `000014_create_article_categories_pivot_table`
15. `000015_create_galleries_table` (with `core.tenants(id)`)
16. `000016_create_support_messages_table` (with `core.tenants(id)` & `core.users(id)`)
17. `000017_create_newsletter_subscribers_table`
18. `000018_create_tenant_payment_gateways_table` (with `core.tenants(id)`)
