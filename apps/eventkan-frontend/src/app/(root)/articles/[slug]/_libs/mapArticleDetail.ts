import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';

import type { ArticleDetail, ArticleDetailApiRecord } from '@/interfaces/features/articles';

export function mapArticleDetail(article: ArticleDetailApiRecord): ArticleDetail {
  const wordCount = article.content.split(/\s+/).filter(Boolean).length;
  const category =
    article.category?.name ||
    article.articleCategories
      ?.map((item) => item.name)
      .filter(Boolean)
      .join(' · ');
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
    author: article.created_by_name ?? article.createdByName ?? 'Admin EVENTKAN',
    isDb: true,
  };
}
