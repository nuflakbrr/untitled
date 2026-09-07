'use server';

import type { z } from 'zod';
import type { articleSchema } from '@/schemas/articles';
import type {
  Article,
  ArticleResponse,
  ArticleCategoryResponse,
  ArticlePaginationResponse,
  ArticleCategoryPaginationResponse,
} from '@/interfaces/features/articles';

import api from '@/lib/api';
import { revalidatePath } from 'next/cache';

export type ArticleValues = z.infer<typeof articleSchema>;
const endpoint = '/features/v1/articles';
const categoryEndpoint = '/features/v1/article-categories';
const path = '/admin/publications/articles';
const paged = async (params: Record<string, unknown>): Promise<ArticlePaginationResponse> => {
  try {
    const body = (await api.get(endpoint, { params })).data;
    const includeDeleted = Boolean(params.includeDeleted);
    const data = (body.data ?? []).filter((item: Record<string, unknown>) =>
      includeDeleted
        ? Boolean(item.deleted_at ?? item.deletedAt)
        : !(item.deleted_at ?? item.deletedAt)
    );
    const total = data.length;
    const page = Number(params.page ?? 1);
    const limit = Number(params.limit ?? 10);
    return { success: true, data, meta: { total, page, lastPage: Math.ceil(total / limit) || 1 } };
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, lastPage: 1 } };
  }
};
export async function getArticles(page = 1, limit = 10, search = '', includeDeleted = false) {
  return paged({ page, limit, search, includeDeleted });
}
export async function getArticleById(id: string): Promise<ArticleResponse> {
  try {
    return { success: true, data: (await api.get(`${endpoint}/${id}`)).data.data };
  } catch {
    return { success: false, error: 'Artikel tidak ditemukan.' };
  }
}
export async function createArticle(values: ArticleValues): Promise<ArticleResponse> {
  try {
    const result = await api.post(endpoint, values);
    revalidatePath(path);
    return { success: true, data: result.data.data, message: 'Artikel berhasil dibuat.' };
  } catch {
    return { success: false, error: 'Gagal membuat artikel.' };
  }
}
export async function updateArticleById(
  id: string,
  values: ArticleValues
): Promise<ArticleResponse> {
  try {
    const result = await api.put(`${endpoint}/${id}`, values);
    revalidatePath(path);
    return { success: true, data: result.data.data, message: 'Artikel berhasil diperbarui.' };
  } catch {
    return { success: false, error: 'Gagal memperbarui artikel.' };
  }
}
export async function deleteArticleById(id: string): Promise<ArticleResponse> {
  try {
    await api.delete(`${endpoint}/${id}`);
    revalidatePath(path);
    return { success: true, message: 'Artikel berhasil dihapus.' };
  } catch {
    return { success: false, error: 'Gagal menghapus artikel.' };
  }
}
export async function restoreArticle(id: string): Promise<ArticleResponse> {
  try {
    await api.patch(`${endpoint}/${id}/restore`);
    revalidatePath(path);
    return { success: true, message: 'Artikel berhasil dipulihkan.' };
  } catch {
    return { success: false, error: 'Gagal memulihkan artikel.' };
  }
}
export async function permanentlyDeleteArticle(id: string): Promise<ArticleResponse> {
  try {
    await api.delete(`${endpoint}/${id}/permanent`);
    revalidatePath(path);
    return { success: true, message: 'Artikel berhasil dihapus permanen.' };
  } catch {
    return { success: false, error: 'Gagal menghapus artikel permanen.' };
  }
}
export async function deleteBulkArticles(ids: string[]): Promise<ArticleResponse> {
  try {
    await Promise.all(ids.map((id) => api.delete(`${endpoint}/${id}`)));
    revalidatePath(path);
    return { success: true, message: 'Artikel berhasil dihapus.' };
  } catch {
    return { success: false, error: 'Gagal menghapus artikel.' };
  }
}
export async function getCategories(
  includeDeleted = false
): Promise<ArticleCategoryPaginationResponse> {
  try {
    const data =
      (await api.get(categoryEndpoint, { params: { include_deleted: includeDeleted } })).data
        .data ?? [];
    return { success: true, data, meta: { total: data.length, page: 1, lastPage: 1 } };
  } catch {
    return { success: false, data: [], meta: { total: 0, page: 1, lastPage: 1 } };
  }
}
export async function createCategory(name: string): Promise<ArticleCategoryResponse> {
  try {
    return { success: true, data: (await api.post(categoryEndpoint, { name })).data.data };
  } catch {
    return { success: false, error: 'Gagal membuat kategori.' };
  }
}
export async function updateCategory(id: string, name: string): Promise<ArticleCategoryResponse> {
  try {
    return {
      success: true,
      data: (await api.put(`${categoryEndpoint}/${id}`, { name })).data.data,
    };
  } catch {
    return { success: false, error: 'Gagal memperbarui kategori.' };
  }
}
export async function deleteCategory(id: string): Promise<ArticleCategoryResponse> {
  try {
    await api.delete(`${categoryEndpoint}/${id}`);
    return { success: true, message: 'Kategori berhasil dihapus.' };
  } catch {
    return { success: false, error: 'Gagal menghapus kategori.' };
  }
}
export async function restoreCategory(id: string): Promise<ArticleCategoryResponse> {
  try {
    await api.patch(`${categoryEndpoint}/${id}/restore`);
    return { success: true, message: 'Kategori berhasil dipulihkan.' };
  } catch {
    return { success: false, error: 'Gagal memulihkan kategori.' };
  }
}
export async function permanentlyDeleteCategory(id: string): Promise<ArticleCategoryResponse> {
  try {
    await api.delete(`${categoryEndpoint}/${id}/permanent`);
    return { success: true, message: 'Kategori berhasil dihapus permanen.' };
  } catch {
    return { success: false, error: 'Gagal menghapus kategori permanen.' };
  }
}
export async function getPublicArticles(): Promise<Article[]> {
  try {
    return (await api.get(endpoint, { params: { limit: 100 } })).data.data ?? [];
  } catch {
    return [];
  }
}
