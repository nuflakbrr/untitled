import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import ArticleDetailClient from './_components/ArticleDetail';
import { getArticleDetail, mapArticleDetail } from './_libs/getArticleDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticleDetail(slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan - SITIVENT',
    };
  }

  // Strip HTML tags for clean description excerpt
  const plainText = article.content.replace(/<[^>]*>/g, '');
  return {
    title: `${article.title} - SITIVENT`,
    description: plainText.substring(0, 150),
  };
}

export const revalidate = 0; // Dynamic rendering

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const article = await getArticleDetail(slug);
  if (!article) notFound();

  return <ArticleDetailClient initialArticle={mapArticleDetail(article)} />;
}
