# API Contract: Registrations & Payments

> **Base URL**: `/features/v1`

---

## 1. Register Participant to Event
- **Method**: `POST /features/v1/registrations`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "event_id": "20000000-0000-0000-0001-000000000001",
  "online_attendance": false
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Pendaftaran berhasil",
  "data": {
    "registration_id": "40000000-0000-0000-0001-000000000001",
    "registration_number": "REG-SEMINAR-2026-0001",
    "qr_token": "valid-token-scan1-12345",
    "status": "REGISTERED",
    "payment": null
  }
}
```

---

## 2. Upload Payment Proof (Peserta)
- **Method**: `POST /features/v1/payments/proof`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "registration_id": "40000000-0000-0000-0001-000000000004",
  "proof_url": "https://storage.googleapis.com/..."
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin."
}
```

---

## 3. Verify Payment (Admin Panitia)
- **Method**: `POST /features/v1/payments/:id/verify`
- **Headers**: `Authorization: Bearer <token>` (Permission: `payments.verify`)
- **Request Body**:
```json
{
  "status": "PAID",
  "notes": "Pembayaran sesuai mutasi rekening"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Pembayaran berhasil diverifikasi. Tiket peserta telah diaktifkan."
}
```
