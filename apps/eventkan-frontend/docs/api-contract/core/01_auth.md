# API Contract: Authentication (Frontend Integration)

> **Base Route**: `/core/v1/auth`

---

## 1. Sign In (`POST /core/v1/auth/signin`)
- **Payload**:
```typescript
interface SignInRequest {
  email: string;
  password: string;
}
```
- **Response**:
```typescript
interface SignInResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      roles: string[];
      permissions: string[];
    };
  };
}
```

---

## 2. Sign Up (`POST /core/v1/auth/signup`)
- **Payload**:
```typescript
interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}
```
