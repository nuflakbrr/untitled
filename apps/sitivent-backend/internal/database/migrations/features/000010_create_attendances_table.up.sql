DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('SUCCESS', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS attendances (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    registration_id VARCHAR(36) REFERENCES registrations(id) ON DELETE CASCADE,
    scan_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scanner_id VARCHAR(36) REFERENCES core.users(id) ON DELETE SET NULL,
    status attendance_status NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_attendances_registration_id ON attendances(registration_id);
CREATE INDEX IF NOT EXISTS idx_attendances_scanner_id ON attendances(scanner_id);

