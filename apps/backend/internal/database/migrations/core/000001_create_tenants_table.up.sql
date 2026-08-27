CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE tenant_type AS ENUM ('ROOT', 'FACULTY', 'DEPARTMENT', 'UNIT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    type tenant_type NOT NULL DEFAULT 'FACULTY',
    parent_id VARCHAR(36) REFERENCES tenants(id) ON DELETE SET NULL,
    logo_url TEXT,
    website VARCHAR(255),
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_parent_id ON tenants(parent_id);

