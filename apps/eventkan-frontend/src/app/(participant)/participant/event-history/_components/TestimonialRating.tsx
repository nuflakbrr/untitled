import { Star } from 'lucide-react';

import type { TestimonialRatingProps } from '@/interfaces/features/testimonials';

import { TESTIMONIAL_RATINGS } from '../_constants/testimonial.constants';

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
            className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-eventkan-accent/30"
            aria-label={`Rating ${star} bintang`}
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                activeStar
                  ? 'fill-eventkan-accent text-eventkan-accent'
                  : 'fill-[var(--eventkan-canvas)] text-eventkan-muted/40'
              }`}
            />
          </button>
        );
      })}
      <span className="ml-2 text-sm font-semibold text-eventkan-muted">
        {hoverRating || rating} / 5
      </span>
    </div>
  );
}
