# API Contract: Registrations & Payments (Frontend Integration)

> **Base Route**: `/features/v1/registrations` & `/features/v1/payments`

---

## 1. Register to Event (`POST /features/v1/registrations`)
- **Payload**:
```typescript
interface RegisterPayload {
  event_id: string;
  online_attendance?: boolean;
}
```
- **Response**:
```typescript
interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    registration_id: string;
    registration_number: string;
    qr_token: string;
    status: 'WAITING_PAYMENT' | 'REGISTERED';
  };
}
```

---

## 2. Upload Payment Proof (`POST /features/v1/payments/proof`)
- **Payload**:
```typescript
interface PaymentProofPayload {
  registration_id: string;
  proof_url: string;
}
```
