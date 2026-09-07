# API Contract: Certificates

> **Base URL**: `/features/v1/certificates`

---

## 1. Verify Public Certificate
- **Method**: `GET /features/v1/certificates/:id/verify`
- **Authentication**: None (Public)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "certificate_number": "CERT/SEMINAR-2026/0001",
    "participant_name": "Peserta Scan 1",
    "event_title": "Seminar Teknologi & Inovasi 2026",
    "event_date": "2026-10-10",
    "issued_at": "2026-10-11T10:00:00Z",
    "signatures": [
      {
        "name": "Dr. Budi Santoso, M.Kom.",
        "title": "Ketua Pelaksana",
        "signature_url": "https://..."
      }
    ],
    "pdf_url": "https://..."
  }
}
```
