CREATE TABLE IF NOT EXISTS core.account_reactivation_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES core.users(id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_account_reactivation_tokens_user_id
    ON core.account_reactivation_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_account_reactivation_tokens_expiry
    ON core.account_reactivation_tokens(expires_at);
