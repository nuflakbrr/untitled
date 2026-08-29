import { z } from 'zod';

import { CONFIG } from 'src/global-config';

const speakerSchema = z.object({
  id: z.string().nullish(),
  name: z.string(),
  title: z.string().nullish(),
  company: z.string().nullish(),
  company_url: z.string().nullish(),
  github: z.string().nullish(),
  instagram: z.string().nullish(),
  linked_in: z.string().nullish(),
  avatar: z.string().nullish(),
  order: z.number().nullish(),
});

const benefitSchema = z.object({
  id: z.string().nullish(),
  title: z.string(),
  description: z.string().nullish(),
  icon: z.string().nullish(),
  order: z.number().nullish(),
});

const eventSchema = z.object({
  id: z.string(),
  tenant_id: z.string().nullish(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  banner: z.string().nullish(),
  start_date: z.string(),
  end_date: z.string().nullish(),
  start_time: z.string(),
  end_time: z.string().nullish(),
  location: z.string(),
  meeting_link: z.string().nullish(),
  event_type: z.enum(['ONLINE', 'OFFLINE']),
  online_attendance: z.boolean().nullish(),
  registration_deadline: z.string().nullish(),
  quota: z.number(),
  price: z.number(),
  status: z.string().nullish(),
  certificate_enabled: z.boolean().nullish(),
  category_id: z.string().nullish(),
  category: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullish(),
    })
    .nullish(),
  tenant: z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      code: z.string().nullish(),
      type: z.string().nullish(),
      logo_url: z.string().nullish(),
      website: z.string().nullish(),
    })
    .nullish(),
  created_by_id: z.string().nullish(),
  creator: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      avatar_url: z.string().nullish(),
    })
    .nullish(),
  speakers: z.array(speakerSchema).nullish(),
  benefits: z.array(benefitSchema).nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
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

export async function getPublicEvents(categorySlug?: string): Promise<PublicEvent[]> {
  const baseUrl = (CONFIG.serverApiUrl ?? CONFIG.apiUrl).replace(/\/+$/, '');
  const category = categorySlug ? `&category_slug=${encodeURIComponent(categorySlug)}` : '';
  const response = await fetch(
    `${baseUrl}/features/v1/events?status=PUBLISHED&page=1&limit=50${category}`,
    {
      next: { revalidate: 60, tags: ['events'] },
    }
  );

  if (!response.ok) throw new Error(`Events API returned ${response.status}`);

  return responseSchema.parse(await response.json()).data ?? [];
}

export async function getPublicEvent(slug: string): Promise<PublicEvent | null> {
  const baseUrl = (CONFIG.serverApiUrl ?? CONFIG.apiUrl).replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/features/v1/events/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60, tags: [`event-${slug}`] },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Event API returned ${response.status}`);
  const payload = z.object({ data: eventSchema.nullish() }).parse(await response.json());
  return payload.data ?? null;
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const baseUrl = (CONFIG.serverApiUrl ?? CONFIG.apiUrl).replace(/\/+$/, '');
  const response = await fetch(`${baseUrl}/features/v1/event-categories`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Categories API returned ${response.status}`);
  const payload = z
    .object({ data: z.array(categorySchema).nullish() })
    .parse(await response.json());
  return payload.data ?? [];
}

export function getPublicGalleries() {
  return getPublicCollection('/features/v1/galleries?featured=true&limit=6&page=1', gallerySchema);
}
