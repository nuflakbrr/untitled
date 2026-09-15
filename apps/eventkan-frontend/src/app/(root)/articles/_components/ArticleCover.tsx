import type { FC } from 'react';

import type { ArticleCoverProps } from '@/interfaces/features/articles';

const ArticleCover: FC<ArticleCoverProps> = ({ className }) => (
  <div className={`relative overflow-hidden ${className}`} />
);

export default ArticleCover;
