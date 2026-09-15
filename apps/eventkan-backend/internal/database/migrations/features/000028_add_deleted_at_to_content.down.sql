DROP INDEX IF EXISTS idx_articles_deleted_at;
DROP INDEX IF EXISTS idx_galleries_deleted_at;
DROP INDEX IF EXISTS idx_article_categories_deleted_at;
ALTER TABLE articles DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE galleries DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE article_categories DROP COLUMN IF EXISTS deleted_at;
