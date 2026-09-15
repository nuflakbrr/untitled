# API Contract: Events & Categories

> **Base URL**: `/features/v1`

---

## 1. List Event Categories
- **Method**: `GET /features/v1/event-categories`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "20000000-0000-0000-0000-000000000001",
      "name": "Seminar",
      "slug": "seminar",
      "description": "Acara seminar dan kuliah tamu"
    }
  ]
}
```

---

## 2. List Events
- **Method**: `GET /features/v1/events`
- **Query Params**: `category_slug`, `status`, `event_type`, `search`, `page`, `limit`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "20000000-0000-0000-0001-000000000001",
      "title": "Seminar Teknologi & Inovasi 2026",
      "slug": "seminar-teknologi-2026",
      "banner": "https://...",
      "start_date": "2026-10-10T00:00:00Z",
      "price": 0,
      "quota": 200,
      "status": "PUBLISHED"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 1 }
}
```

---

## 3. Create Event
- **Method**: `POST /features/v1/events`
- **Headers**: `Authorization: Bearer <token>` (Permission: `events.create`)
- **Request Body**:
```json
{
  "title": "Workshop Full-Stack Next.js",
  "category_id": "20000000-0000-0000-0000-000000000002",
  "description": "<p>Deskripsi workshop...</p>",
  "banner": "https://...",
  "start_date": "2026-10-20T00:00:00Z",
  "end_date": "2026-10-21T00:00:00Z",
  "start_time": "09:00",
  "end_time": "17:00",
  "location": "Lab Komputer Lt. 3",
  "event_type": "OFFLINE",
  "quota": 40,
  "price": 150000,
  "registration_deadline": "2026-10-18T23:59:59Z",
  "certificate_enabled": true,
  "speakers": [
    {
      "name": "Alex Pratama",
      "title": "Senior Engineer",
      "company": "Tech Corp",
      "avatar": "https://..."
    }
  ],
  "benefits": [
    { "title": "E-Certificate", "icon": "solar:document-bold" }
  ]
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "data": { "id": "...", "slug": "workshop-full-stack-nextjs" }
}
```
