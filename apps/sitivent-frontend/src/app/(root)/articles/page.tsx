import type { Metadata } from 'next';

import ArticlesGrid from './_components/ArticlesGrid';
import ArticlesHeader from './_components/ArticlesHeader';
import { getArticlesPageData } from './_libs/getArticlesPageData';

export const metadata: Metadata = {
  title: 'Pusat Artikel & Edukasi - SITIVENT',
  description:
    'Temukan artikel teknologi, panduan event, tips & trik, serta tutorial integrasi terbaik dari SITIVENT.',
};

export const revalidate = 0; // Dynamic rendering

export default async function ArticlesPage() {
  const { articles, categories } = await getArticlesPageData();

  return (
    <section className="min-h-screen bg-[#f6f3eb] pb-24 text-[#111927]">
      <ArticlesHeader />

      <div className="mx-auto max-w-295 px-4 md:px-0">
        <ArticlesGrid initialItems={articles} categories={categories} />
      </div>
    </section>
  );
}
