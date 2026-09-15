import { useState } from 'react';

import type { ArticleDetail } from '@/interfaces/features/articles';

import {
  getArticleReadTime,
  getArticleShareUrl,
  getArticleTocItems,
  getArticleWordCount,
  createArticleMarkdown,
} from '../_libs/articleDetail.libs';

export const useArticleDetail = (article: ArticleDetail) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [hoveredTermDef, setHoveredTermDef] = useState('');

  const wordCount = getArticleWordCount(article);
  const readTimeMinutes = getArticleReadTime(wordCount);
  const tocItems = getArticleTocItems(article);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(createArticleMarkdown(article)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    });
  };

  const handleShare = (platform: 'whatsapp' | 'linkedin') => {
    const shareUrl = getArticleShareUrl(platform, article.title, window.location.href);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const showTermDefinition = (term: string, definition: string) => {
    setHoveredTerm(term);
    setHoveredTermDef(definition);
  };

  const clearTermDefinition = () => setHoveredTerm(null);

  return {
    copied,
    shareCopied,
    hoveredTerm,
    hoveredTermDef,
    wordCount,
    readTimeMinutes,
    tocItems,
    handleCopyMarkdown,
    handleCopyLink,
    handleShare,
    showTermDefinition,
    clearTermDefinition,
  };
};
