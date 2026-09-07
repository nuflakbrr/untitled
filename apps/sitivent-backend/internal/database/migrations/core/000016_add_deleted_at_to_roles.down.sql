DROP INDEX IF EXISTS core.idx_roles_deleted_at;
ALTER TABLE core.roles DROP COLUMN IF EXISTS deleted_at;
