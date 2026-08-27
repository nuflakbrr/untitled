CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    expires_at TIMESTAMPTZ NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    impersonated_by VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

