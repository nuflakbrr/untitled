ALTER TABLE certificates
    ADD COLUMN signatures_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb;
