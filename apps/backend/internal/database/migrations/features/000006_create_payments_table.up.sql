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
    provider VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
    transaction_id VARCHAR(100),
    payment_method VARCHAR(50),
    payment_channel VARCHAR(50),
    payment_url TEXT,
    proof_url TEXT,
    expired_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    verified_by_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
