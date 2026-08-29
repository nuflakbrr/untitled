import { z } from 'zod';

import { CONFIG } from 'src/global-config';

const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  banner: z.string().nullish(),
  start_date: z.string(),
  start_time: z.string(),
  location: z.string(),
  event_type: z.enum(['ONLINE', 'OFFLINE']),
  quota: z.number(),
  price: z.number(),
  certificate_enabled: z.boolean(),
  category: z.object({ id: z.string(), name: z.string(), slug: z.string() }).nullish(),
});

const responseSchema = z.object({ data: z.array(eventSchema).nullish() });

const categorySchema = z.object({ id: z.string(), name: z.string(), slug: z.string() });
const gallerySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  image_url: z.string(),
  featured: z.boolean(),
  event_id: z.string().nullish(),
});

export type PublicEvent = z.infer<typeof eventSchema>;
export type PublicCategory = z.infer<typeof categorySchema>;
export type PublicGallery = z.infer<typeof gallerySchema>;

async function getPublicCollection<T>(path: string, schema: z.ZodType<T>) {
  const baseUrl = (CONFIG.serverApiUrl ?? CONFIG.apiUrl).replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}${path}`, {
    next: { revalidate: 60, tags: ['public-home'] },
  });
  if (!response.ok) throw new Error(`Public API returned ${response.status}`);
  const payload = z.object({ data: z.array(schema).nullish() }).parse(await response.json());
  return payload.data ?? [];
}

export async function getPublicEvents(): Promise<PublicEvent[]> {
  const baseUrl = (CONFIG.serverApiUrl ?? CONFIG.apiUrl).replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/features/v1/events?status=PUBLISHED&page=1&limit=6`, {
    next: { revalidate: 60, tags: ['events'] },
  });

  if (!response.ok) throw new Error(`Events API returned ${response.status}`);

  return responseSchema.parse(await response.json()).data ?? [];
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const baseUrl = (CONFIG.serverApiUrl ?? CONFIG.apiUrl).replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/features/v1/event-categories`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Categories API returned ${response.status}`);
  const payload = z.object({ data: z.array(categorySchema).nullish() }).parse(await response.json());
  return payload.data ?? [];
}

export function getPublicGalleries() {
  return getPublicCollection('/features/v1/galleries?featured=true&limit=6&page=1', gallerySchema);
}
