-- Roles become tenant-scoped: NULL tenant_id = shared/global template role
-- (root_superadmin, superadmin, panitia, scanner, peserta), non-NULL = a
-- custom role created by/for that specific tenant, visible only there.
ALTER TABLE core.roles ADD COLUMN tenant_id VARCHAR(36) REFERENCES core.tenants(id) ON DELETE CASCADE;

-- Global role names stay unique among themselves; a tenant's custom role
-- names only need to be unique within that tenant (different tenants can
-- each have their own "koordinator" role without colliding).
ALTER TABLE core.roles DROP CONSTRAINT IF EXISTS roles_name_key;
CREATE UNIQUE INDEX idx_roles_global_name ON core.roles (name) WHERE tenant_id IS NULL;
CREATE UNIQUE INDEX idx_roles_tenant_name ON core.roles (tenant_id, name) WHERE tenant_id IS NOT NULL;
CREATE INDEX idx_roles_tenant_id ON core.roles (tenant_id);
