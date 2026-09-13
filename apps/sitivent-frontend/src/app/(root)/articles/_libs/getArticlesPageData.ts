import type { ArticlesPageData } from '@/interfaces/features/articles';

import { getPublicArticles, getPublicArticleCategories } from '@/services/public/articles';

import { mapArticleItems } from './mapArticleItems';

export const getArticlesPageData = async (): Promise<ArticlesPageData> => {
  const [articles, articleCategories] = await Promise.all([
    getPublicArticles(),
    getPublicArticleCategories(),
  ]);
  const categories = articleCategories.map((category) => category.name);
  const categoryNames = new Map(
    articleCategories.map((category) => [category.id, category.name])
  );

  return {
    articles: mapArticleItems(articles, categoryNames),
    categories,
  };
};
