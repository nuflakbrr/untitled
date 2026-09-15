import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';

import type { Article, ArticleItem } from '@/interfaces/features/articles';

export const mapArticleItems = (
  articles: Article[],
  categoryNames: ReadonlyMap<string, string>
): ArticleItem[] =>
  articles.map((article) => {
    const content = article.content ?? '';
    const plainTextContent = content.replace(/<[^>]*>/g, '');
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const categories =
      article.categoryIds
        ?.map((categoryId) => categoryNames.get(categoryId))
        .filter((category): category is string => Boolean(category)) ?? [];

    return {
      id: article.slug || article.id,
      category: categories[0] ?? 'Tanpa kategori',
      categories,
      title: article.title,
      description:
        plainTextContent.substring(0, 150) + (plainTextContent.length > 150 ? '...' : ''),
      readTime: `${Math.max(1, Math.ceil(wordCount / 200))} menit baca`,
      date: moment(article.createdAt).tz('Asia/Jakarta').locale('id').format('D MMMM YYYY'),
      author: 'EVENTKAN Team',
      cover: article.cover,
    };
  });
