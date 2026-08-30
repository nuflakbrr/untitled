DROP INDEX IF EXISTS core.idx_roles_tenant_id;
DROP INDEX IF EXISTS core.idx_roles_tenant_name;
DROP INDEX IF EXISTS core.idx_roles_global_name;
ALTER TABLE core.roles ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE core.roles DROP COLUMN IF EXISTS tenant_id;
