ALTER TABLE event_categories
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_event_categories_deleted_at ON event_categories(deleted_at);
