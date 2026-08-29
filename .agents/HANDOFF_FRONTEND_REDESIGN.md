# Frontend Redesign Handoff

## Status

- Branch: `feat/fe/total-redesign`
- Scope delivered: shared SITIVENT identity, public root, sign-in, dashboard shell, dashboard overview, and event module placeholder.
- Route slugs and authentication flow are unchanged.
- The branch has not been committed or pushed.

## Design direction

- Product character: modern, energetic, and trust-first for a university event platform.
- Public UI: editorial event discovery, asymmetric composition, generous spacing, and prominent real event imagery.
- Admin UI: denser Material UI workspace with a responsive sidebar, active navigation, tenant context, and clear operational hierarchy.
- Shared identity: cobalt `#3659D9`, blue-slate neutrals, DM Sans body copy, Barlow display headings, 10px base radius, light and dark schemes.
- Use semantic success, warning, and error colors only for status and feedback. Do not introduce another decorative accent.

## Data and architecture

- Public event data is fetched only in the root Server Component through `src/lib/api/events.ts`.
- Endpoint: `GET /features/v1/events?status=PUBLISHED&page=1&limit=6`.
- The Zod schema is the frontend contract boundary. Update it when the backend DTO changes.
- The public root renders explicit empty states when API data is unavailable; it does not ship fake event or gallery records.
- Events, categories, and featured galleries are fetched server-side from their public backend endpoints. Statistics are derived from the returned event payload because no public dashboard-statistics route is currently wired.
- Authentication remains Server Action based. Do not restore browser-facing `/api/auth/*` proxy routes.
- Dashboard navigation is intentionally limited to implemented routes. Add menu items only when their pages exist.

## Main files

- `src/theme/theme-config.ts` and `src/theme/core/palette.ts`: brand tokens and color schemes.
- `src/components/logo/logo.tsx`: shared SITIVENT identity.
- `src/components/color-mode-button.tsx`: shared theme control.
- `src/layouts/main/`: public header, navigation, and footer.
- `src/sections/home/view/home-view.tsx`: redesigned public root.
- `src/layouts/dashboard/layout.tsx`: responsive admin shell and tenant switcher.
- `src/app/(dashboard)/dashboard/`: admin overview and event module surface.
- `src/app/(auth)/`: redesigned sign-in experience.

## Landing page content order

Outside the shared navbar and footer, the root page now follows the approved seven-block order:

1. Event carousel: title, description, registration CTA, event image, date, location, and slide controls.
2. Category filter pills: all events, competition, conference, seminar, webinar, and workshop.
3. Featured events: populated cards when the API returns events, otherwise the designed empty state.
4. Platform statistics: active events, registered participants, and issued certificates.
5. Event documentation gallery with asymmetric image mosaic.
6. Six benefit cards explaining why participants should join.
7. Dark certificate CTA with account and event discovery actions.

## Deliberate boundaries

- Article and support pages remain legacy surfaces and are no longer linked from the redesigned root. Redesign them when they become part of the SITIVENT content roadmap.
- Event cards do not link to a public detail page because that route does not exist yet. Add the route and CTA together to avoid broken navigation.
- Event create/list controls remain disabled until Sprint 7.2 connects the admin module to the backend.
- Static legacy Open Graph PNG files still exist, but root metadata now uses SITIVENT event imagery and no longer references them.

## Continuation checklist

1. Build `/events/[slug]` as a Server Component using `GET /features/v1/events/:slug`.
2. Implement event list, filters, form, and lifecycle actions under `/dashboard/events`.
3. Redesign article and support surfaces or remove them when the product scope is confirmed.
4. Replace placeholder empty states with university-owned media when production content is available.
5. Run responsive and dark-mode visual QA at 375px, 768px, 1280px, and 1440px.
6. Verify `bun run test`, `bun run tsc:check`, `bun run lint`, and `bun run build` before handoff or PR.

## Accessibility guardrails

- Preserve visible keyboard focus and logical heading order.
- Keep all touch targets at least 40px high.
- Do not encode event status using color alone.
- Respect the existing reduced-motion infrastructure and avoid essential information in animation.

## Verification completed

- `bun run test`: 2 tests passed.
- `bun run tsc:check`: passed before and after production build.
- `bun run lint`: passed.
- `bun run build`: passed, including 38 generated routes.
- Browser QA: public root, sign-in, and dashboard checked on desktop and 375px mobile in light and dark mode.
- Browser console: no errors or warnings after the navigation and tenant selector fixes.
- Browser network: the public root did not expose the backend event request as a browser fetch.
