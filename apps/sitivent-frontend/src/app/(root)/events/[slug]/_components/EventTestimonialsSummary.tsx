import type { FC } from 'react';

import { Star } from 'lucide-react';

import type { EventTestimonialsSummaryProps } from '@/interfaces/features/testimonials';

const EventTestimonialsSummary: FC<EventTestimonialsSummaryProps> = ({
  averageRating,
  totalCount,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-[#E3DACC] bg-white p-3">
      <div className="font-serif text-2xl font-bold text-[#141413]">{averageRating}</div>
      <div className="flex flex-col">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3.5 w-3.5 ${
                star <= Math.round(averageRating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-[#87867F]">{totalCount} Ulasan</span>
      </div>
    </div>
  );
};

export default EventTestimonialsSummary;
