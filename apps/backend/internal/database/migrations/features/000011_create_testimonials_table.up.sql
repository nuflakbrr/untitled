CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    registration_id VARCHAR(36) NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_event_id ON testimonials(event_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id);

