'use server';

import type {
  Article,
  ArticleCategory,
  ArticleDetailApiRecord,
} from '@/interfaces/features/articles';

import api from '@/lib/api';

export async function getPublicArticles(): Promise<Article[]> {
  try {
    const items =
      (await api.get('/features/v1/articles', { params: { limit: 100 } })).data.data ?? [];

    return items.map((item: Article & { category_ids?: string[] }) => ({
      ...item,
      categoryIds: item.categoryIds ?? item.category_ids ?? [],
    }));
  } catch {
    return [];
  }
}

export async function getPublicArticleCategories(): Promise<ArticleCategory[]> {
  try {
    return (await api.get('/features/v1/article-categories')).data.data ?? [];
  } catch {
    return [];
  }
}

export async function getArticleDetail(identifier: string): Promise<ArticleDetailApiRecord | null> {
  try {
    return (await api.get(`/features/v1/articles/by-slug/${identifier}`)).data.data;
  } catch {
    try {
      return (await api.get(`/features/v1/articles/${identifier}`)).data.data;
    } catch {
      return null;
    }
  }
}
