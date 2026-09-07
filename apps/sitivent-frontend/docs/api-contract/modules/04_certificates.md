# API Contract: Certificates (Frontend Integration)

> **Base Route**: `/features/v1/certificates`

---

## 1. Verify Public Certificate (`GET /features/v1/certificates/:id/verify`)
- **Headers**: None (Public Endpoint)
- **Response `200 OK`**:
```typescript
interface PublicCertificateResponse {
  success: boolean;
  data: {
    certificate_number: string;
    participant_name: string;
    event_title: string;
    event_date: string;
    issued_at: string;
    signatures: Array<{
      name: string;
      title: string;
      signature_url: string;
    }>;
    pdf_url?: string;
  };
}
```
