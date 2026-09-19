DROP INDEX IF EXISTS idx_registrations_attendance_proof_status;
ALTER TABLE registrations DROP COLUMN IF EXISTS attendance_proof_reviewed_by, DROP COLUMN IF EXISTS attendance_proof_reviewed_at, DROP COLUMN IF EXISTS attendance_proof_status, DROP COLUMN IF EXISTS attendance_proof_url;
