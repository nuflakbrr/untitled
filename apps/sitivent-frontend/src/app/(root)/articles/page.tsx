import 'moment-timezone';
import 'moment/locale/id';

import type { Metadata } from 'next';

import api from '@/lib/api';
import moment from 'moment';
import { Empty, EmptyTitle, EmptyHeader, EmptyDescription } from '@/components/ui/empty';

import ArticlesGrid from './_components/ArticlesGrid';
import ArticlesHeader from './_components/ArticlesHeader';

export const metadata: Metadata = {
  title: 'Pusat Artikel & Edukasi - SITIVENT',
  description:
    'Temukan artikel teknologi, panduan event, tips & trik, serta tutorial integrasi terbaik dari SITIVENT.',
};

export const revalidate = 0; // Dynamic rendering

export default async function ArticlesPage() {
  // 1. Fetch data from DB
  let articles: Array<Record<string, any>> = [];
  try { articles = (await api.get('/features/v1/articles', { params: { page: 1, limit: 100 } })).data.data ?? []; } catch { /* empty state */ }

  // 2. Map data to article schema
  const mapped = articles.map((item) => {
    const category = item.category?.name || item.articleCategories?.[0]?.name || 'Tips & Trik';
    const date = moment(item.created_at ?? item.createdAt)
      .tz('Asia/Jakarta')
      .locale('id')
      .format('D MMMM YYYY');
    // Strip HTML tags for clean card description excerpt
    const plainTextContent = String(item.content ?? '').replace(/<[^>]*>/g, '');
    const description =
      plainTextContent.substring(0, 150) + (plainTextContent.length > 150 ? '...' : '');

    // Calculate read time based on word count (200 words per minute average)
    const wordCount = String(item.content ?? '').split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${readTimeMinutes} menit baca`;

    return {
      id: item.slug || item.id,
      category,
      title: item.title,
      description,
      readTime,
      date,
      author: 'SITIVENT Team',
      cover: item.cover,
    };
  });

  return (
    <section
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
      style={{ background: '#FAF9F5' }}
    >
      <ArticlesHeader />

      {/* Grid Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {mapped.length === 0 ? (
          <Empty
            className="py-24 border rounded-2xl bg-white dark:bg-zinc-900 shadow-xs"
            style={{ borderColor: '#E3DACC' }}
          >
            <EmptyHeader>
              <EmptyTitle>Artikel Tidak Ditemukan</EmptyTitle>
              <EmptyDescription>
                Saat ini belum ada artikel edukasi yang ditambahkan.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ArticlesGrid initialItems={mapped} />
        )}
      </div>
    </section>
  );
}
