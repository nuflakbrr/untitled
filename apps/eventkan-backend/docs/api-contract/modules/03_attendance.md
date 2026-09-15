# API Contract: Attendance QR Scanner

> **Base URL**: `/features/v1/attendances`

---

## 1. Scan QR Code Attendance
- **Method**: `POST /features/v1/attendances/scan`
- **Headers**: `Authorization: Bearer <token>` (Permission: `attendance.scan`)
- **Request Body**:
```json
{
  "qr_token": "valid-token-scan1-12345",
  "event_id": "20000000-0000-0000-0001-000000000001"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Presensi berhasil dicatat",
  "data": {
    "participant_name": "Peserta Scan 1",
    "email": "peserta-scan-1@gmail.com",
    "registration_number": "REG-SCAN-1-2026",
    "scan_time": "2026-10-10T09:15:30Z",
    "status": "SUCCESS"
  }
}
```
- **Response `409 Conflict`** (Sudah pernah check in):
```json
{
  "success": false,
  "error": "Peserta sudah melakukan check-in pada 2026-10-10 09:05:00"
}
```
