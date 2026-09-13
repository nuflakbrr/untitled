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
          <h2 className="font-serif text-2xl font-bold text-[#141413]">
            Ulasan & Testimoni Peserta
          </h2>
          <p className="mt-1 text-xs text-[#87867F]">
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
