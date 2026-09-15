import type { ArticleDetail, ArticleTocItem } from '@/interfaces/features/articles';

export const getArticleWordCount = (article: ArticleDetail): number => {
  if (article.content) {
    return article.content.split(/\s+/).filter(Boolean).length;
  }

  let count = article.tldr?.split(/\s+/).filter(Boolean).length ?? 0;
  article.steps?.forEach((step) => {
    count += step.title.split(/\s+/).filter(Boolean).length;
    count += step.body.split(/\s+/).filter(Boolean).length;
  });

  return count;
};

export const getArticleReadTime = (wordCount: number): number =>
  Math.max(1, Math.ceil(wordCount / 200));

export const getArticleTocItems = (article: ArticleDetail): ArticleTocItem[] => {
  const items: ArticleTocItem[] = [];

  if (article.tldr) {
    items.push({ id: 'ringkasan', label: 'Ringkasan Cepat' });
  }

  if (article.isDb) {
    items.push({ id: 'konten-utama', label: 'Konten Utama' });
    return items;
  }

  if (article.flowchart) {
    items.push({ id: 'alur-proses', label: 'Alur Proses' });
  }
  if (article.steps) {
    items.push({ id: 'langkah-langkah', label: 'Langkah Demi Langkah' });
  }
  if (article.tabs) {
    items.push({ id: 'implementasi-kode', label: 'Implementasi Kode' });
  }
  if (article.faqs) {
    items.push({ id: 'faq', label: 'Tanya Jawab (FAQ)' });
  }

  return items;
};

export const createArticleMarkdown = (article: ArticleDetail): string => {
  if (article.isDb && article.content) {
    return `# ${article.title}\n\n${article.content}\n\n*Sumber: EVENTKAN Publications*`;
  }

  if (article.steps) {
    const stepsMarkdown = article.steps
      .map((step, index) => `${index + 1}. **${step.title}** (${step.location})\n   ${step.body}`)
      .join('\n\n');

    return `# ${article.title}\n\n**TL;DR:** ${article.tldr}\n\n## Langkah-Langkah:\n\n${stepsMarkdown}\n\n*Sumber: EVENTKAN Publications*`;
  }

  return `# ${article.title}\n\n*Sumber: EVENTKAN Publications*`;
};

export const getArticleShareUrl = (
  platform: 'whatsapp' | 'linkedin',
  title: string,
  pageUrl: string,
): string => {
  if (platform === 'whatsapp') {
    return `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl}`)}`;
  }

  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
};
