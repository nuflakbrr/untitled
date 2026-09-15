import { Star } from 'lucide-react';

import type { TestimonialRatingProps } from '@/interfaces/features/testimonials';

import { TESTIMONIAL_RATINGS } from '../_constants/testimonial';

export default function TestimonialRating({
  rating,
  hoverRating,
  onRatingChange,
  onHoverChange,
}: TestimonialRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      {TESTIMONIAL_RATINGS.map((star) => {
        const activeStar = hoverRating ? star <= hoverRating : star <= rating;

        return (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange(star)}
            onMouseLeave={() => onHoverChange(0)}
            className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff7a45]/30"
            aria-label={`Rating ${star} bintang`}
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                activeStar
                  ? 'fill-[#ff7a45] text-[#ff7a45]'
                  : 'fill-[#f6f3eb] text-[#6c7280]/40'
              }`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm font-semibold text-[#6c7280]">
        {hoverRating || rating} / 5
      </span>
    </div>
  );
}
