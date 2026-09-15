CREATE TABLE IF NOT EXISTS core._role_to_user (
    "A" VARCHAR(36) NOT NULL REFERENCES core.roles(id) ON DELETE CASCADE,
    "B" VARCHAR(36) NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    PRIMARY KEY ("A", "B")
);

CREATE INDEX IF NOT EXISTS idx_role_to_user_b ON core._role_to_user("B");
