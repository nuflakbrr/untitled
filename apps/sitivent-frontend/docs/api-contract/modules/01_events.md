# API Contract: Events (Frontend Integration)

> **Base Route**: `/features/v1/events`

---

## 1. List Events (`GET /features/v1/events`)
- **Query Parameters**:
```typescript
interface EventQueryParams {
  category_slug?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'COMPLETED';
  event_type?: 'ONLINE' | 'OFFLINE';
  search?: string;
  page?: number;
  limit?: number;
}
```
- **Response**:
```typescript
interface EventListResponse {
  success: boolean;
  data: EventListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

---

## 2. Event Detail (`GET /features/v1/events/:slug`)
- **Response**:
```typescript
interface EventDetailResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    slug: string;
    description: string;
    banner: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    location: string;
    eventType: 'ONLINE' | 'OFFLINE';
    onlineAttendance: boolean;
    meetingLink?: string;
    registrationDeadline: string;
    quota: number;
    price: number;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'COMPLETED';
    certificateEnabled: boolean;
    category?: { id: string; name: string; slug: string };
    speakers: Array<{ name: string; title: string; company: string; avatar: string }>;
    benefits: Array<{ title: string; icon: string }>;
  };
}
```
