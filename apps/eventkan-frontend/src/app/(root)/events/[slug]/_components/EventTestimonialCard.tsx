import 'moment-timezone';
import 'moment/locale/id';

import type { FC } from 'react';

import moment from 'moment';
import { Star, User } from 'lucide-react';

import type { EventTestimonialCardProps } from '@/interfaces/features/testimonials';

const EventTestimonialCard: FC<EventTestimonialCardProps> = ({ testimonial }) => (
  <div className="space-y-3 rounded-[18px] border border-[#111927]/10 bg-[#fffdf8] p-5">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        {testimonial.user?.image ? (
          <img
            src={testimonial.user.image}
            alt={testimonial.user.name || 'Peserta'}
            className="h-8 w-8 rounded-full border border-[#111927]/10 object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe5d8] text-xs font-bold text-[#ff7a45]">
            {testimonial.user?.name ? (
              testimonial.user.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-[#11233f]">
            {testimonial.user?.name || 'Peserta Event'}
          </p>
          <p className="text-[10px] text-[#6c7280]">
            {moment(testimonial.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMM YYYY')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-full border border-[#111927]/10 bg-[#f6f3eb] px-2.5 py-1 text-xs font-semibold text-[#11233f]">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span>{testimonial.rating} / 5</span>
      </div>
    </div>

    <p className="text-xs leading-relaxed text-[#4b5565] sm:text-sm">
      &ldquo;{testimonial.comment}&rdquo;
    </p>
  </div>
);

export default EventTestimonialCard;
