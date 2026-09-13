import 'moment-timezone';
import 'moment/locale/id';

import type { FC } from 'react';

import moment from 'moment';
import { Star, User } from 'lucide-react';

import type { EventTestimonialCardProps } from '@/interfaces/features/testimonials';

const EventTestimonialCard: FC<EventTestimonialCardProps> = ({ testimonial }) => (
  <div className="space-y-3 rounded-2xl border border-[#E3DACC] bg-white p-5">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        {testimonial.user?.image ? (
          <img
            src={testimonial.user.image}
            alt={testimonial.user.name || 'Peserta'}
            className="h-8 w-8 rounded-full border border-[#E3DACC] object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(217,119,87,0.1)] text-xs font-bold text-[#D97757]">
            {testimonial.user?.name ? (
              testimonial.user.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-[#141413]">
            {testimonial.user?.name || 'Peserta Event'}
          </p>
          <p className="text-[10px] text-[#87867F]">
            {moment(testimonial.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMM YYYY')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-full border border-[#E3DACC] bg-[#FAF9F5] px-2.5 py-1 text-xs font-semibold">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span>{testimonial.rating} / 5</span>
      </div>
    </div>

    <p className="text-xs leading-relaxed text-[#3D3D3A] sm:text-sm">
      &ldquo;{testimonial.comment}&rdquo;
    </p>
  </div>
);

export default EventTestimonialCard;
