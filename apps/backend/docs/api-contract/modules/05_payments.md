# API Contract: Payments & iPaymu Gateway

> **Base URL**: `/features/v1/payments`

---

## 1. Request Payment Checkout (Peserta)

Membuat tagihan pembayaran ke iPaymu menggunakan kredensial tenant penyelenggara event.

- **Method**: `POST /features/v1/payments/checkout`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "registration_id": "40000000-0000-0000-0001-000000000004",
  "payment_method": "va",
  "payment_channel": "bca"
}
```

- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Tagihan pembayaran berhasil dibuat",
  "data": {
    "payment_id": "50000000-0000-0000-0001-000000000001",
    "provider": "IPAYMU",
    "transaction_id": "12984921",
    "payment_method": "va",
    "payment_channel": "bca",
    "virtual_account_number": "118200081222222222",
    "qr_code_url": null,
    "payment_url": "https://sandbox.ipaymu.com/payment/12984921",
    "amount": 150000,
    "fee": 3500,
    "total": 153500,
    "expired_at": "2026-10-19T23:59:59Z"
  }
}
```

---

## 2. iPaymu Webhook Callback (Public Webhook)

Menerima konfirmasi pembayaran sukses dari server iPaymu dan mengaktifkan tiket QR secara real-time.

- **Method**: `POST /features/v1/payments/webhook/ipaymu`
- **Request Body (from iPaymu)**:

```json
{
  "trx_id": "12984921",
  "sid": "40000000-0000-0000-0001-000000000004",
  "status": "berhasil",
  "status_code": "1",
  "via": "va",
  "channel": "bca",
  "amount": "150000",
  "signature": "a1b2c3d4e5f6..."
}
```

- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

## 3. Tenant Payment Gateway Settings (Admin Fakultas / Rektorat)

- **Method**: `GET /core/v1/tenants/:id/payment-gateway`
- **Headers**: `Authorization: Bearer <token>` (Permission: `tenant.update`)
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": {
    "tenant_id": "10000000-0000-0000-0000-000000000002",
    "provider": "IPAYMU",
    "is_active": true,
    "virtual_account": "081222222222",
    "env": "sandbox",
    "bank_name": "Bank Mandiri",
    "bank_account_number": "1370001234567",
    "bank_account_holder": "Fakultas Ilmu Komputer UMN"
  }
}
```
