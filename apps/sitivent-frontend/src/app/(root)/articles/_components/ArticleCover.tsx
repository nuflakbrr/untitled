import type { FC } from 'react';

interface ArticleCoverProps {
  className: string;
}

const ArticleCover: FC<ArticleCoverProps> = ({ className }) => (
  <div className={`relative overflow-hidden ${className}`} />
);

export default ArticleCover;
