import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import type { ArticleDetailPageProps } from '@/interfaces/features/articles';

import { genPageMetadata } from '@/app/seo';
import { getArticleDetail } from '@/services/public/articles';

import { mapArticleDetail } from './_libs/mapArticleDetail';
import ArticleDetailClient from './_components/ArticleDetail';

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticleDetail(slug);

  if (!article) {
    return genPageMetadata({ title: 'Artikel Tidak Ditemukan' });
  }

  const plainText = article.content.replace(/<[^>]*>/g, '');
  return genPageMetadata({
    title: article.title,
    description: plainText.substring(0, 150),
    image: article.cover ?? undefined,
  });
}

export const revalidate = 0; // Dynamic rendering

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;

  const article = await getArticleDetail(slug);
  if (!article) notFound();

  return <ArticleDetailClient initialArticle={mapArticleDetail(article)} />;
}
