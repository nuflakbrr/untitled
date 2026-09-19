import type { FC } from 'react';

import type { Article } from '@/interfaces/features/articles';

import { getArticleById } from '@/services/admin/articles';

import ArticleForm from './_components/ArticleForm';

type Props = {
  params: Promise<{ id: string }>;
};

const ArticleDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const isNew = id === 'new';

  let initialData: Article | null = null;

  if (!isNew) {
    const result = await getArticleById(id);
    if (result.success && result.data) {
      initialData = result.data as Article;
    }
  }

  return <ArticleForm initialData={initialData} />;
};

export default ArticleDetailCMS;
