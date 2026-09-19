ALTER TABLE registrations
    ADD COLUMN IF NOT EXISTS attendance_proof_url TEXT,
    ADD COLUMN IF NOT EXISTS attendance_proof_status VARCHAR(20) NOT NULL DEFAULT 'NONE',
    ADD COLUMN IF NOT EXISTS attendance_proof_reviewed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS attendance_proof_reviewed_by VARCHAR(36) REFERENCES core.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_registrations_attendance_proof_status ON registrations(attendance_proof_status);
