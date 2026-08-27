DO $$ BEGIN
    CREATE TYPE email_status AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS email_queues (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "to" VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    attachments TEXT,
    status email_status NOT NULL DEFAULT 'PENDING',
    attempts INT NOT NULL DEFAULT 0,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_queues_status ON email_queues(status);
CREATE INDEX IF NOT EXISTS idx_email_queues_created_at ON email_queues(created_at);

