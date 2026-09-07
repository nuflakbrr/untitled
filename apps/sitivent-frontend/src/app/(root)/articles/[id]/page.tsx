import 'moment-timezone';
import 'moment/locale/id';

import type { Metadata } from 'next';

import api from '@/lib/api';
import moment from 'moment';
import { notFound } from 'next/navigation';

import ArticleDetailClient from './_components/ArticleDetail';

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchArticle(identifier: string) {
  try {
    return (await api.get(`/features/v1/articles/by-slug/${identifier}`)).data.data;
  } catch {
    try { return (await api.get(`/features/v1/articles/${identifier}`)).data.data; } catch { return null; }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  if (id === 'zoom-integration' || id === 'webhook-security') {
    const title =
      id === 'zoom-integration'
        ? 'Panduan Integrasi Zoom dan Event Online'
        : 'Keamanan Webhook & Sinkronisasi Pembayaran';
    return {
      title: `${title} - SITIVENT`,
      description: 'Panduan teknis dan edukasi untuk platform SITIVENT.',
    };
  }

  let article: any = null;
  article = await fetchArticle(id);

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
  const { id } = await params;

  let article = null;
  const isStatic = id === 'zoom-integration' || id === 'webhook-security';

  if (!isStatic) {
    article = await fetchArticle(id);

    if (!article) {
      notFound();
    }
  }

  let mapped = null;
  if (article) {
    const wordCount = article.content.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${readTimeMinutes} menit baca`;

    mapped = {
      id: article.id,
      category: article.category?.name || article.articleCategories?.[0]?.name || 'Tips & Trik',
      title: article.title,
      content: article.content,
      cover: article.cover,
      date: moment(article.created_at ?? article.createdAt)
        .tz('Asia/Jakarta')
        .locale('id')
        .format('D MMMM YYYY'),
      readTime,
      author:
        article.created_by_name ??
        article.createdByName ??
        (article.created_by_id === '48e8167e-0105-4242-b6db-9bb12dc84bce'
          ? 'Superadmin Universitas (Rektorat)'
          : 'Admin SITIVENT'),
      isDb: true,
    };
  }

  return <ArticleDetailClient initialArticle={mapped} staticId={id} />;
}
