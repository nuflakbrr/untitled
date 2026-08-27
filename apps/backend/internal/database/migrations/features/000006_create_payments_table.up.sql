DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('WAITING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    registration_id VARCHAR(36) NOT NULL UNIQUE REFERENCES registrations(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    status payment_status NOT NULL DEFAULT 'WAITING',
    proof_url TEXT,
    verified_at TIMESTAMPTZ,
    verified_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON payments(registration_id);

