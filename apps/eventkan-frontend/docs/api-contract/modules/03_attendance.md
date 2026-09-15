# API Contract: Attendance QR Scanner (Frontend Integration)

> **Base Route**: `/features/v1/attendances`

---

## 1. Check-In via Scanner (`POST /features/v1/attendances/scan`)
- **Payload**:
```typescript
interface ScanPayload {
  qr_token: string;
  event_id: string;
}
```
- **Response `200 OK`**:
```typescript
interface ScanSuccessResponse {
  success: boolean;
  message: string;
  data: {
    participant_name: string;
    email: string;
    registration_number: string;
    scan_time: string;
    status: 'SUCCESS';
  };
}
```
- **Response `409 Conflict`**:
```typescript
interface ScanConflictResponse {
  success: boolean;
  error: string; // "Peserta sudah melakukan check-in pada ..."
}
```
