import type { ArticleDetail } from './articles';

export interface ArticleDetailClientProps {
  initialArticle: ArticleDetail;
}

export interface ArticleTocItem {
  id: string;
  label: string;
}

export interface ArticleDetailApiRecord {
  id: string;
  title: string;
  content: string;
  cover?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  created_by_id?: string | null;
  createdById?: string | null;
  created_by_name?: string | null;
  createdByName?: string | null;
  category?: { name?: string | null } | null;
  articleCategories?: Array<{ name?: string | null }>;
}
