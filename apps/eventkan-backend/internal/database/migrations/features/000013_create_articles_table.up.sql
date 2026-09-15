CREATE TABLE IF NOT EXISTS articles (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tenant_id VARCHAR(36) REFERENCES core.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    cover TEXT,
    slug VARCHAR(255) UNIQUE,
    created_by_id VARCHAR(36) REFERENCES core.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_tenant_id ON articles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_by ON articles(created_by_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
