DROP INDEX IF EXISTS idx_users_deleted_at;
ALTER TABLE core.users DROP COLUMN IF EXISTS deleted_at;
