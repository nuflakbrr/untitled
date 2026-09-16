import type { FC } from 'react';

import type { EventTestimonialsProps } from '@/interfaces/features/events';

import { getEventTestimonials } from '@/services/public/testimonials';

import EventTestimonialCard from './EventTestimonialCard';
import EmptyEventTestimonials from './EmptyEventTestimonials';
import EventTestimonialsSummary from './EventTestimonialsSummary';

const EventTestimonials: FC<EventTestimonialsProps> = async ({ eventId }) => {
  const { testimonials, averageRating, totalCount } = await getEventTestimonials(eventId);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-[-.03em] text-eventkan-navy">
            Ulasan & Testimoni Peserta
          </h2>
          <p className="mt-1 text-sm text-eventkan-muted">
            Ulasan resmi dari peserta yang telah menghadiri event ini.
          </p>
        </div>
        <EventTestimonialsSummary
          averageRating={averageRating}
          totalCount={totalCount}
        />
      </div>

      {totalCount === 0 ? (
        <EmptyEventTestimonials />
      ) : (
        <div className="space-y-3">
          {testimonials.map((testimonial) => (
            <EventTestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTestimonials;
