import type { FC } from 'react';

import type { EventBenefitsProps } from '@/interfaces/features/events';

import { getBenefitIcon } from '../_libs/eventDetail.libs';

const EventBenefits: FC<EventBenefitsProps> = ({ benefits }) => {
  if (benefits.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-extrabold tracking-[-.03em] text-eventkan-navy">Benefit Event</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => {
          const Icon = getBenefitIcon(benefit.icon);

          return (
            <div key={benefit.id || index} className="flex items-start gap-3 rounded-[18px] border border-eventkan-ink/10 bg-eventkan-surface p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eventkan-peach text-eventkan-accent"><Icon className="h-4 w-4" /></div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-eventkan-navy">{benefit.title}</p>
                {benefit.description && <p className="text-xs leading-relaxed text-eventkan-muted">{benefit.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventBenefits;
