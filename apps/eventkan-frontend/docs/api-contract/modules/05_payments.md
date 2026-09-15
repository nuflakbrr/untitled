# API Contract: Payments & iPaymu (Frontend Integration)

> **Base Route**: `/features/v1/payments`

---

## 1. Request Checkout (`POST /features/v1/payments/checkout`)

- **Payload**:

```typescript
interface CheckoutPayload {
  registration_id: string;
  payment_method: 'va' | 'qris' | 'cstore' | 'ewallet';
  payment_channel: string; // e.g. 'bca', 'mandiri', 'gopay', 'qris'
}
```

- **Response**:

```typescript
interface CheckoutResponse {
  success: boolean;
  data: {
    payment_id: string;
    provider: 'IPAYMU' | 'MANUAL';
    transaction_id: string;
    virtual_account_number?: string;
    qr_code_url?: string;
    payment_url?: string;
    amount: number;
    fee: number;
    total: number;
    expired_at: string;
  };
}
```

---

## 2. Update Tenant Gateway Settings (`PUT /core/v1/tenants/:id/payment-gateway`)

- **Payload**:

```typescript
interface UpdateTenantGatewayPayload {
  provider: 'IPAYMU' | 'MANUAL';
  is_active: boolean;
  api_key?: string;
  virtual_account?: string;
  env?: 'sandbox' | 'production';
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
}
```
