CREATE TABLE IF NOT EXISTS core.users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tenant_id VARCHAR(36) REFERENCES core.tenants(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    role VARCHAR(50),
    banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    ban_expires TIMESTAMPTZ,
    role_id VARCHAR(36)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON core.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON core.users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON core.users(tenant_id);
