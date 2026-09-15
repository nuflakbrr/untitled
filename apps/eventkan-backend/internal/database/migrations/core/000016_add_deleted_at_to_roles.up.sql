ALTER TABLE core.roles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_roles_deleted_at ON core.roles (deleted_at);
