CREATE TABLE IF NOT EXISTS galleries (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    event_id VARCHAR(36) REFERENCES events(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_galleries_event_id ON galleries(event_id);
CREATE INDEX IF NOT EXISTS idx_galleries_featured ON galleries(featured);

