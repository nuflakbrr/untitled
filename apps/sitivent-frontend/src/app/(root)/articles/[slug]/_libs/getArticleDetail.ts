import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';

import type { ArticleDetail, ArticleDetailApiRecord } from '@/interfaces/features/articles';

import api from '@/lib/api';

const SUPERADMIN_ID = '48e8167e-0105-4242-b6db-9bb12dc84bce';

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

export function mapArticleDetail(article: ArticleDetailApiRecord): ArticleDetail {
  const wordCount = article.content.split(/\s+/).filter(Boolean).length;
  const category =
    article.category?.name || article.articleCategories?.map((item) => item.name).filter(Boolean).join(' · ');
  const createdAt = article.created_at ?? article.createdAt;

  return {
    id: article.id,
    category: category || 'Tanpa kategori',
    title: article.title,
    content: article.content,
    cover: article.cover,
    date: createdAt
      ? moment(createdAt).tz('Asia/Jakarta').locale('id').format('D MMMM YYYY')
      : 'Tanggal tidak tersedia',
    readTime: `${Math.max(1, Math.ceil(wordCount / 200))} menit baca`,
    author:
      article.created_by_name ??
      article.createdByName ??
      (article.created_by_id === SUPERADMIN_ID
        ? 'Superadmin Universitas (Rektorat)'
        : 'Admin SITIVENT'),
    isDb: true,
  };
}
