# Database Conventions & Migrations - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Konvensi skema PostgreSQL, Hierarchical Multi-Tenancy (`tenants`), UUID Primary Keys, aturan granular `golang-migrate` (1 tabel per migrasi), dan SQL seeders idempotent.

---

## 1. Konvensi Skema PostgreSQL

1. **Identifier Unik (Primary Key)**: Seluruh tabel wajib menggunakan `VARCHAR(36)` dengan nilai *default* `gen_random_uuid()::text`.
2. **Multi-Tenant Scoping**:
   - Seluruh tabel domain (`events`, `event_categories`, `certificate_templates`, `articles`, `galleries`, `support_messages`, `tenant_payment_gateways`) memiliki kolom `tenant_id VARCHAR(36) REFERENCES tenants(id)`.
   - Tabel `users` memiliki kolom `tenant_id VARCHAR(36) REFERENCES tenants(id)` untuk mengikat admin/panitia ke fakultasnya (NULL untuk peserta umum/universal).
3. **Audit Columns**: Setiap tabel utama wajib menyertakan:
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
   - `deleted_at TIMESTAMPTZ` (untuk soft delete)

---

## 2. Struktur Tabel Multi-Tenant (`tenants`)

```sql
CREATE TYPE tenant_type AS ENUM ('ROOT', 'FACULTY', 'DEPARTMENT', 'UNIT');

CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    type tenant_type NOT NULL DEFAULT 'FACULTY',
    parent_id VARCHAR(36) REFERENCES tenants(id) ON DELETE SET NULL,
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

### A. Core Migrations (`migrations/core/`)
1. `000001_create_tenants_table`
2. `000002_create_users_table`
3. `000003_create_sessions_table`
4. `000004_create_accounts_table`
5. `000005_create_verifications_table`
6. `000006_create_roles_table`
7. `000007_create_permissions_table`
8. `000008_create_role_has_permissions_table`
9. `000009_create_model_has_permissions_table`
10. `000010_create_audit_logs_table`
11. `000011_create_email_queues_table`
12. `000012_create_role_to_user_table`

### B. Feature Migrations (`migrations/features/`)
1. `000001_create_event_categories_table` (with `tenant_id`)
2. `000002_create_events_table` (with `tenant_id`)
3. `000003_create_event_benefits_table`
4. `000004_create_event_speakers_table`
5. `000005_create_registrations_table`
6. `000006_create_payments_table` (with iPaymu provider & fields)
7. `000007_create_certificate_templates_table` (with `tenant_id`)
8. `000008_create_certificate_signatures_table`
9. `000009_create_certificates_table`
10. `000010_create_attendances_table`
11. `000011_create_testimonials_table`
12. `000012_create_article_categories_table`
13. `000013_create_articles_table` (with `tenant_id`)
14. `000014_create_article_categories_pivot_table`
15. `000015_create_galleries_table` (with `tenant_id`)
16. `000016_create_support_messages_table` (with `tenant_id`)
17. `000017_create_newsletter_subscribers_table`
18. `000018_create_tenant_payment_gateways_table` (with `tenant_id`)
