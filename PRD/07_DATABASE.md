# Database Conventions & Schema - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> **Database Engine**: PostgreSQL 16/17/18  
> **Migration Tool**: `golang-migrate`  
> **Granularity**: 1 Migration = 1 Table  

---

## 1. Aturan Penamaan & Konvensi Skema

1. **Primary Key**:
   - Seluruh tabel menggunakan UUID v4 `VARCHAR(36)` dengan nilai default `DEFAULT gen_random_uuid()::text`.
2. **Audit Columns**:
   - Setiap tabel wajib memiliki `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` dan `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
   - Tabel transaksi yang mendukung soft delete memiliki kolom `deleted_at TIMESTAMPTZ`.
3. **Foreign Keys & Relasi**:
   - Gunakan nama relasi eksplisit `_id` (misal: `event_id`, `user_id`, `category_id`).
   - Terapkan `ON DELETE CASCADE` atau `ON DELETE SET NULL` secara konsisten.
4. **Enums PostgreSQL**:
   - Enum didefinisikan secara independen sebelum tabel dibuat:
     - `event_type` (`ONLINE`, `OFFLINE`)
     - `event_status` (`DRAFT`, `PUBLISHED`, `CLOSED`, `COMPLETED`)
     - `registration_status` (`WAITING_PAYMENT`, `REGISTERED`, `CANCELLED`, `CHECKED_IN`)
     - `payment_status` (`WAITING`, `PAID`, `FAILED`, `REFUNDED`)
     - `cert_number_mode` (`AUTO`, `MANUAL`)
     - `attendance_status` (`SUCCESS`, `FAILED`)
     - `email_status` (`PENDING`, `PROCESSING`, `SENT`, `FAILED`)

---

## 2. Struktur Migrasi Database (`1 Migration = 1 Table`)

Migrasi diorganisir menjadi 2 modul independen di dalam `apps/backend/internal/database/migrations/`:

### A. Modul Core (`migrations/core/`):
- `000001_create_users_table` (`users`)
- `000002_create_sessions_table` (`sessions`)
- `000003_create_accounts_table` (`accounts`)
- `000004_create_verifications_table` (`verifications`)
- `000005_create_roles_table` (`roles`)
- `000006_create_permissions_table` (`permissions`)
- `000007_create_role_has_permissions_table` (`role_has_permissions`)
- `000008_create_model_has_permissions_table` (`model_has_permissions`)
- `000009_create_audit_logs_table` (`audit_logs`)
- `000010_create_email_queues_table` (`email_queues`)
- `000011_create_role_to_user_table` (`_role_to_user`)

### B. Modul Features (`migrations/features/`):
- `000001_create_event_categories_table` (`event_categories`)
- `000002_create_events_table` (`events`)
- `000003_create_event_benefits_table` (`event_benefits`)
- `000004_create_event_speakers_table` (`event_speakers`)
- `000005_create_registrations_table` (`registrations`)
- `000006_create_payments_table` (`payments`)
- `000007_create_certificate_templates_table` (`certificate_templates`)
- `000008_create_certificate_signatures_table` (`certificate_signatures`)
- `000009_create_certificates_table` (`certificates`)
- `000010_create_attendances_table` (`attendances`)
- `000011_create_testimonials_table` (`testimonials`)
- `000012_create_article_categories_table` (`article_categories`)
- `000013_create_articles_table` (`articles`)
- `000014_create_article_categories_pivot_table` (`_article_to_article_category`)
- `000015_create_galleries_table` (`galleries`)
- `000016_create_support_messages_table` (`support_messages`)
- `000017_create_newsletter_subscribers_table` (`newsletter_subscribers`)

---

## 3. Database Seeding Idempotent (`seeders/`)

Seluruh data seeder ditulis dalam berkas SQL murni dengan klausul `ON CONFLICT` sehingga aman dieksekusi berulang kali tanpa menghasilkan duplikasi:

- `apps/backend/internal/database/seeders/core/`:
  - `001_permissions.sql` (39 Permissions dasar)
  - `002_roles_and_role_permissions.sql` (`superadmin`, `panitia`, `scanner`, `peserta`)
  - `003_users_and_accounts.sql` (7 User seed & password hash bcrypt)
- `apps/backend/internal/database/seeders/features/`:
  - `001_event_categories.sql` (5 Kategori)
  - `002_events.sql` (5 Event contoh)
  - `003_registrations_payments_attendances.sql` (Pendaftaran, pembayaran, absensi)
  - `004_support_messages.sql` (Tiket bantuan)
  - `005_galleries.sql` (Galeri kegiatan)
  - `006_articles_and_categories.sql` (Artikel & pivot relasi)

---

## 4. Eksekusi Setup Database

```bash
# Menjalankan seluruh migrasi dan seeder
make db-setup

# Reset database total (drop, recreate, migrate, seed)
make db-reset
```
