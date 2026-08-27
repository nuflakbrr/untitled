# Backend Feature: Artikel & Publikasi - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Articles & Publications  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL Many-to-Many

---

## 1. Arsitektur Data Artikel

- **Tabel Kategori**: `article_categories` (`id`, `name`, `created_at`, `updated_at`)
- **Tabel Artikel**: `articles` (`id`, `title`, `slug`, `content`, `cover`, `created_by_id`, `created_at`, `updated_at`)
- **Tabel Pivot Many-to-Many**: `_article_to_article_category` (`"A"` = article_id, `"B"` = article_category_id)

---

## 2. Fitur & Operasi Backend

1. **Katalog Publik**: `GET /features/v1/articles` mendukung filter kategori, pencarian judul, dan pagination.
2. **Detail Artikel**: `GET /features/v1/articles/:slug` mengambil konten lengkap beserta kategori dan data penulis.
3. **Manajemen Admin**:
   - `POST /features/v1/articles` (Permission: `article.create`)
   - `PUT /features/v1/articles/:id` (Permission: `article.update`)
   - `DELETE /features/v1/articles/:id` (Permission: `article.delete`)
