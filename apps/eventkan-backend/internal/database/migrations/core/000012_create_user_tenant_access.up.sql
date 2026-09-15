CREATE TABLE IF NOT EXISTS core.user_has_tenants (
    user_id VARCHAR(36) NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    tenant_id VARCHAR(36) NOT NULL REFERENCES core.tenants(id) ON DELETE CASCADE,
    role_id VARCHAR(36) REFERENCES core.roles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_user_has_tenants_tenant ON core.user_has_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_has_tenants_role ON core.user_has_tenants(role_id);

INSERT INTO core.user_has_tenants (user_id, tenant_id, role_id)
SELECT id, tenant_id, role_id FROM core.users WHERE tenant_id IS NOT NULL
ON CONFLICT (user_id, tenant_id) DO UPDATE SET role_id = EXCLUDED.role_id, updated_at = NOW();
