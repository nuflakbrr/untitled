# API Contract: Tenant Management (Frontend Integration)

> **Base Route**: `/core/v1/tenants`

---

## 1. List Faculties (`GET /core/v1/tenants`)

- **Response**:

```typescript
interface Tenant {
  id: string;
  name: string;
  slug: string;
  code: string;
  type: 'ROOT' | 'FACULTY' | 'DEPARTMENT' | 'UNIT';
  parentId?: string | null;
  logoUrl?: string;
  website?: string;
  description?: string;
}

interface TenantListResponse {
  success: boolean;
  data: Tenant[];
}
```

---

## 2. Create Faculty Tenant (`POST /core/v1/tenants`)

- **Payload**:

```typescript
interface CreateTenantPayload {
  name: string;
  slug: string;
  code: string;
  type: 'FACULTY';
  parent_id?: string;
  website?: string;
  description?: string;
}
```
