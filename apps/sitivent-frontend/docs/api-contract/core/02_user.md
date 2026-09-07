# API Contract: User Management (Frontend Integration)

> **Base Route**: `/core/v1/users`

---

## 1. List Users (`GET /core/v1/users`)

- **Query Parameters**: `search`, `role`, `status`, `page`, `limit`
- **Response**:

```typescript
interface UserListResponse {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    email: string;
    image?: string;
    banned: boolean;
    banReason?: string;
    roles: string[];
    createdAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

---

## 2. Update User Role / Profile (`PUT /core/v1/users/:id`)

- **Payload**:

```typescript
interface UpdateUserPayload {
  name?: string;
  email?: string;
  roles?: string[];
}
```
