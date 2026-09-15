CREATE TABLE IF NOT EXISTS event_speakers (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    company VARCHAR(255),
    company_url TEXT,
    github VARCHAR(255),
    instagram VARCHAR(255),
    linked_in VARCHAR(255),
    avatar TEXT,
    "order" INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON event_speakers(event_id);

