import type { FC } from 'react';

import type { EventBenefitsProps } from '@/interfaces/features/events';

import { getBenefitIcon } from '../_libs/eventDetail';

const EventBenefits: FC<EventBenefitsProps> = ({ benefits }) => {
  if (benefits.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-extrabold tracking-[-.03em] text-[#11233f]">Benefit Event</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => {
          const Icon = getBenefitIcon(benefit.icon);

          return (
            <div key={benefit.id || index} className="flex items-start gap-3 rounded-[18px] border border-[#111927]/10 bg-[#fffdf8] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe5d8] text-[#ff7a45]"><Icon className="h-4 w-4" /></div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#11233f]">{benefit.title}</p>
                {benefit.description && <p className="text-xs leading-relaxed text-[#6c7280]">{benefit.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventBenefits;
