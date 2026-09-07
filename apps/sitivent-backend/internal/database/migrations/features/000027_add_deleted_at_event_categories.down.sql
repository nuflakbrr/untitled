DROP INDEX IF EXISTS idx_event_categories_deleted_at;

ALTER TABLE event_categories
DROP COLUMN IF EXISTS deleted_at;
