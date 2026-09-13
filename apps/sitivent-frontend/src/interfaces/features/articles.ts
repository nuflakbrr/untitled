import type { ApiResponse, PaginatedResponse } from './common';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | string | null;
  createdById: string | null;
  articleCategories: ArticleCategory[];
  categoryIds?: string[];
}

export interface ArticleCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | string | null;
}

export type ArticleResponse = ApiResponse<Article>;
export type ArticlePaginationResponse = PaginatedResponse<Article>;
export type ArticleCategoryResponse = ApiResponse<ArticleCategory>;
export type ArticleCategoryPaginationResponse = PaginatedResponse<ArticleCategory>;

export interface ArticleItem {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  date: string;
  author: string;
  cover?: string | null;
  categories?: string[];
}

export interface ArticleDetailStep {
  title: string;
  location: string;
  body: string;
}

export interface ArticleDetailTab {
  label: string;
  code: string;
}

export interface ArticleDetailFaq {
  q: string;
  a: string;
}

export interface ArticleDetailFlowchartItem {
  label: string;
  type: 'step' | 'decision';
  detail: string;
}

export interface ArticleDetail {
  id: string;
  category: string;
  title: string;
  description?: string;
  readTime?: string;
  date: string;
  author: string;
  tldr?: string;
  content?: string;
  cover?: string | null;
  steps?: ArticleDetailStep[];
  tabs?: ArticleDetailTab[];
  faqs?: ArticleDetailFaq[];
  jargon?: Record<string, string>;
  flowchart?: ArticleDetailFlowchartItem[];
  isDb?: boolean;
}

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
