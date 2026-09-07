CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS core;

DO $$ BEGIN
    CREATE TYPE core.tenant_type AS ENUM ('ROOT', 'FACULTY', 'DEPARTMENT', 'UNIT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS core.tenants (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    type core.tenant_type NOT NULL DEFAULT 'FACULTY',
    parent_id VARCHAR(36) REFERENCES core.tenants(id) ON DELETE SET NULL,
    logo_url TEXT,
    website VARCHAR(255),
    description TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tenants_slug ON core.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_parent_id ON core.tenants(parent_id);
