CREATE TABLE IF NOT EXISTS verifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    identifier VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verifications_identifier ON verifications(identifier);

