CREATE TABLE IF NOT EXISTS core.role_has_permissions (
    role_id VARCHAR(36) NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) NOT NULL REFERENCES core.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_has_permissions_perm ON core.role_has_permissions(permission_id);
