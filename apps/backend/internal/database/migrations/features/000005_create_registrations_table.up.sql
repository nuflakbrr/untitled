DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('WAITING_PAYMENT', 'REGISTERED', 'CANCELLED', 'CHECKED_IN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS registrations (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    qr_token VARCHAR(255) UNIQUE,
    online_attendance BOOLEAN NOT NULL DEFAULT FALSE,
    status registration_status NOT NULL DEFAULT 'WAITING_PAYMENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_user ON registrations(event_id, user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_number ON registrations(registration_number);
CREATE INDEX IF NOT EXISTS idx_registrations_qr_token ON registrations(qr_token);

