CREATE TABLE IF NOT EXISTS model_has_permissions (
    model_id VARCHAR(36) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    permission_id VARCHAR(36) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    role_id VARCHAR(36) REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (model_id, model_type, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_model_has_permissions_model ON model_has_permissions(model_type, model_id);
CREATE INDEX IF NOT EXISTS idx_model_has_permissions_perm ON model_has_permissions(permission_id);

