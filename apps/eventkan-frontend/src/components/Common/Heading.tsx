import type { FC } from 'react';

import type { Heading as HeadingProps } from '@/interfaces/heading';

const Heading: FC<HeadingProps> = ({
  title,
  description,
  titleSuffix,
  action,
  variant = 'default',
}) => {
  if (variant === 'soft') {
    return (
      <div className="flex items-center justify-between gap-7 rounded-[18px] border border-eventkan-ink/10 bg-[radial-gradient(circle_at_88%_25%,rgba(255,122,69,.09),transparent_190px),linear-gradient(135deg,var(--eventkan-surface),var(--eventkan-canvas))] p-6.5 max-[760px]:flex-col max-[760px]:items-start">
        <div>
          <h1 className="font-display text-[34px] font-extrabold leading-none tracking-[-.04em] text-eventkan-ink">
            {title} {titleSuffix && <span className="text-eventkan-accent">{titleSuffix}</span>}
          </h1>
          <p className="mt-1.75 text-[13px] text-eventkan-muted">{description}</p>
        </div>
        {action}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Heading;
