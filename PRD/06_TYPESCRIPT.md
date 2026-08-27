# TypeScript Rules & Standards - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> **TypeScript**: 5.9+ with Strict Mode Enabled  
> Standar ketat untuk memastikan tidak ada celah _type loophole_ atau inkonsistensi data antara Go Backend API dan Next.js Frontend.

---

## 1. Zero Tolerance for `any`

- **Dilarang Keras** menggunakan tipe `any`:

  ```ts
  // Dilarang
  const data: any = await getEvent(id);

  // Wajib
  const data: EventDetailResponse = await getEvent(id);
  ```

- Jika tipe data dinamis atau belum dapat dipastikan, gunakan `unknown` dan lakukan _type narrowing_ dengan validasi Zod atau _type guard_.

---

## 2. Interface First Architecture (`src/types/`)

Setiap model domain, response API REST, DTO, dan properti komponen didefinisikan dalam interface atau type terdedikasi di `apps/frontend/src/types/`:

```text
apps/frontend/src/types/
├── event.ts               # Event, EventSpeaker, EventBenefit, EventCategory
├── registration.ts        # Registration, RegistrationFilter
├── payment.ts             # Payment, PaymentVerificationInput
├── certificate.ts         # Certificate, CertificateTemplate, Signature
├── article.ts             # Article, ArticleCategory
├── user.ts, role.ts, permission.ts
├── dashboard.ts           # AdminStats, ParticipantStats
├── gallery.ts, support.ts, testimonial.ts
└── auth.ts                # AuthTokens, UserProfile, SignInPayload
```

---

## 3. Component Props Typing

Seluruh komponen React wajib mendefinisikan interface props secara eksplisit:

```tsx
interface EventCardProps {
  event: Event;
  onRegister?: (id: string) => void;
  sx?: SxProps<Theme>;
}

export function EventCard({ event, onRegister, sx }: EventCardProps) {
  // ...
}
```

---

## 4. Type-Check Automation

Sebelum melakukan push ke repository remote, hook `pre-push` secara otomatis menjalankan pengecekan tipe:

```bash
make tsc  # atau bun run tsc:check
```
