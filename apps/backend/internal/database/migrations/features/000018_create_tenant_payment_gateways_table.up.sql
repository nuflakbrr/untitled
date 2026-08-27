CREATE TABLE IF NOT EXISTS tenant_payment_gateways (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tenant_id VARCHAR(36) NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'IPAYMU',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Kredensial iPaymu
    api_key TEXT,
    virtual_account VARCHAR(100),
    env VARCHAR(20) NOT NULL DEFAULT 'sandbox',
    
    -- Fallback Transfer Manual
    bank_name VARCHAR(50),
    bank_account_number VARCHAR(50),
    bank_account_holder VARCHAR(150),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tenant_pg_tenant_id ON tenant_payment_gateways(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_pg_provider ON tenant_payment_gateways(provider);

