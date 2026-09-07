CREATE TABLE certificate_generation_jobs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tenant_id VARCHAR(36) NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    created_by_id VARCHAR(36) NOT NULL REFERENCES core.users(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED')),
    total INT NOT NULL DEFAULT 0 CHECK (total >= 0),
    processed INT NOT NULL DEFAULT 0 CHECK (processed >= 0),
    failed INT NOT NULL DEFAULT 0 CHECK (failed >= 0),
    manual_numbers JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_error TEXT,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX uq_certificate_generation_jobs_active_event
    ON certificate_generation_jobs(event_id)
    WHERE status IN ('PENDING', 'RUNNING');

CREATE INDEX idx_certificate_generation_jobs_status
    ON certificate_generation_jobs(status, created_at);
