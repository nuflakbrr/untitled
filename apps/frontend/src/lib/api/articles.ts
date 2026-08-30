import type { ApiPagination } from './client';

import { z } from 'zod';

import { endpoints } from './endpoints';
import { apiFetch, apiPaginationSchema } from './client';

// ----------------------------------------------------------------------
// Schemas mirror the real backend response shape (apps/backend, internal/
// modules/features/content/dto/content_response.go) — not the old
// marketplace-be contract. That backend has no excerpt/author/published_at/
// per-article category-name fields, so this module derives them:
//   - excerpt: first ~160 chars of `content` with HTML tags stripped
//   - category: resolved from `category_ids[0]` against the categories list
//     (there is no article_categories.slug column backend-side — `slug`
//     below is really the category id, kept as `slug` so ArticleFilters/
//     ArticleItem don't need to change)
//   - author: backend only stores `created_by_id` (no public display name),
//     so this is a fixed generic label until the backend exposes one
//   - published_at: no publish workflow exists yet — every article is public
//     as soon as it's created, so callers fall back to `created_at`

const GENERIC_AUTHOR = 'Tim Redaksi';

// Backend's raw shape (content_response.go ArticleResponse).
const rawArticleSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  cover: z.string().nullish(),
  category_ids: z.array(z.string()).nullish(),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

const articleCategoryRefSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const articleListItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().optional().default(''),
  cover_url: z.string().nullish(),
  author: z.string().optional().default(''),
  category: articleCategoryRefSchema.nullish(),
  published_at: z.string().nullish(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Detail includes the HTML body (produced by BlockNote on the admin side).
// It is UNSANITIZED here — the Markdown component sanitizes before rendering.
export const articleSchema = articleListItemSchema.extend({
  content: z.string(),
});

// Backend's raw shape (content_response.go CategoryResponse) — id + name only.
const rawArticleCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const articleCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  sort_order: z.number().optional().default(0),
  article_count: z.number().optional().default(0),
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toExcerpt(content: string, max = 160): string {
  const text = stripHtml(content);
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function toArticleListItem(
  raw: z.infer<typeof rawArticleSchema>,
  categoryNameByID: Map<string, string>
): z.infer<typeof articleListItemSchema> {
  const categoryID = raw.category_ids?.[0];
  const categoryName = categoryID ? categoryNameByID.get(categoryID) : undefined;

  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: toExcerpt(raw.content),
    cover_url: raw.cover ?? null,
    author: GENERIC_AUTHOR,
    category: categoryID && categoryName ? { slug: categoryID, name: categoryName } : null,
    published_at: null,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export type ArticleListItem = z.infer<typeof articleListItemSchema>;
export type Article = z.infer<typeof articleSchema>;
export type ArticleCategory = z.infer<typeof articleCategorySchema>;

export type ArticlesPage = {
  articles: ArticleListItem[];
  pagination: ApiPagination;
};

export type ArticleListFilters = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

export type RawArticleListParams = {
  page?: string | string[] | null;
  search?: string | string[] | null;
  category?: string | string[] | null;
};

/**
 * Normalize raw URL params (page.tsx `searchParams` or `useSearchParams`)
 * into filters: duplicate params collapse to the first value (`?category=a&
 * category=b` arrives as an array) and `page` is clamped to an integer >= 1
 * (the contract requires `int >= 1` — `2.5`/`1e21` would earn a backend 400).
 */
export function parseArticleListParams(
  params: RawArticleListParams
): Required<Pick<ArticleListFilters, 'page' | 'search' | 'category'>> {
  const first = (value?: string | string[] | null) =>
    (Array.isArray(value) ? value[0] : value) ?? '';

  return {
    page: Math.max(1, parseInt(first(params.page), 10) || 1),
    search: first(params.search),
    category: first(params.category),
  };
}

// Go marshals nil slices as JSON null — normalize to [].
const nullableList = <T extends z.ZodTypeAny>(item: T) =>
  z
    .array(item)
    .nullish()
    .transform((value) => value ?? []);

// ----------------------------------------------------------------------
// Query keys — shared by the client hooks (use-articles.ts) and server-side
// prefetchQuery calls (src/app/article/page.tsx) so hydration lands on the
// same cache entries. Kept OUT of the 'use client' module: importing values
// from a client module into a Server Component yields client references,
// not the real object.

export const ARTICLES_PER_PAGE = 12;

export const articleKeys = {
  all: ['articles'] as const,
  // Serialize EVERY filter that reaches the request (including `limit`) —
  // a filter left out of the key makes two different result sets share one
  // cache entry (page 1 limit 4 vs page 1 limit 12 would collide).
  list: (filters: ArticleListFilters) =>
    [
      ...articleKeys.all,
      'list',
      {
        page: filters.page ?? 1,
        limit: filters.limit ?? ARTICLES_PER_PAGE,
        search: filters.search ?? '',
        category: filters.category ?? '',
      },
    ] as const,
  detail: (slug: string) => [...articleKeys.all, 'detail', slug] as const,
  categories: ['article-categories'] as const,
};

// ----------------------------------------------------------------------
// Fetchers — usable from Server Components (Next Data Cache engaged via
// explicit `next.revalidate`; fetch is NOT cached by default in Next 15/16)
// and from the browser (TanStack Query), where `next` options are ignored.

export const ARTICLES_TAG = 'articles';
export const ARTICLE_CATEGORIES_TAG = 'article-categories';

type FetchOptions = {
  /** Override the server-side Data Cache TTL (default 60s). */
  revalidate?: number;
  /** TanStack Query passes its signal here so unmount/refetch aborts the request. */
  signal?: AbortSignal;
};

function categoryNameMap(categories: ArticleCategory[]): Map<string, string> {
  return new Map(categories.map((c) => [c.id, c.name]));
}

export async function getArticles(
  filters: ArticleListFilters = {},
  options: FetchOptions = {}
): Promise<ArticlesPage> {
  const { page = 1, limit = ARTICLES_PER_PAGE, search, category } = filters;

  const [{ data, meta }, categories] = await Promise.all([
    apiFetch<unknown>(endpoints.articles.list, {
      // `category` here is the category id (see articleCategorySchema note).
      params: { page, limit, search, category },
      signal: options.signal,
      next: { revalidate: options.revalidate ?? 60, tags: [ARTICLES_TAG] },
    }),
    getArticleCategories(undefined, options),
  ]);

  const rawArticles = nullableList(rawArticleSchema).parse(data);
  const nameByID = categoryNameMap(categories);
  const articles = rawArticles.map((raw) => toArticleListItem(raw, nameByID));

  return {
    articles,
    // meta arrives untyped — validate before trusting (contract drift fails
    // loudly here, same rule as `data`).
    pagination: meta?.pagination
      ? apiPaginationSchema.parse(meta.pagination)
      : { page, limit, total: articles.length, total_pages: 1 },
  };
}

export async function getArticle(slug: string): Promise<Article> {
  const [{ data }, categories] = await Promise.all([
    apiFetch<unknown>(endpoints.articles.details(slug), {
      next: { revalidate: 300, tags: [ARTICLES_TAG, `article:${slug}`] },
    }),
    getArticleCategories(),
  ]);

  const raw = rawArticleSchema.parse(data);
  return { ...toArticleListItem(raw, categoryNameMap(categories)), content: raw.content };
}

export async function getArticleCategories(
  _search?: string,
  options: FetchOptions = {}
): Promise<ArticleCategory[]> {
  // Backend has no category search filter — `_search` is accepted for call-site
  // compatibility but not sent; the category list is short enough to fetch whole.
  const { data } = await apiFetch<unknown>(endpoints.articles.categories, {
    signal: options.signal,
    next: { revalidate: options.revalidate ?? 300, tags: [ARTICLE_CATEGORIES_TAG] },
  });

  const raw = nullableList(rawArticleCategorySchema).parse(data);
  return raw.map((c) => ({ id: c.id, slug: c.id, name: c.name, description: '', sort_order: 0, article_count: 0 }));
}
