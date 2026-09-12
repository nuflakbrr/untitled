import type { ArticleItem } from '@/interfaces/features/articles';

import { getCategories, getPublicArticles } from '@/services/admin/articles';

import { mapArticleItems } from './mapArticleItems';

interface ArticlesPageData {
  articles: ArticleItem[];
  categories: string[];
}

export const getArticlesPageData = async (): Promise<ArticlesPageData> => {
  const [articles, categoryResponse] = await Promise.all([getPublicArticles(), getCategories()]);
  const categories = categoryResponse.data.map((category) => category.name);
  const categoryNames = new Map(
    categoryResponse.data.map((category) => [category.id, category.name])
  );

  return {
    articles: mapArticleItems(articles, categoryNames),
    categories,
  };
};
