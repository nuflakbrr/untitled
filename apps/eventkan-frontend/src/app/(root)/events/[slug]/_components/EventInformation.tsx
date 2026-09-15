import type { FC } from 'react';

import { Clock, Globe, MapPin, Calendar, Landmark } from 'lucide-react';

import type { EventInformationProps } from '@/interfaces/features/events';

import EventCover from './EventCover';
import { sanitizeEventDescription } from '../_libs/eventDetail';

const EventInformation: FC<EventInformationProps> = ({ event, formattedStartDate, coverStyle }) => (
  <div className="space-y-10 lg:col-span-2">
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-extrabold tracking-[-.03em] text-[#11233f]">Informasi Event</h2>
      <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#6c7280]">
        <span className="flex items-center gap-1.5">
          {event.eventType === 'ONLINE' ? <Globe className="h-4 w-4 shrink-0 text-[#ff7a45]" /> : <Landmark className="h-4 w-4 shrink-0 text-[#ff7a45]" />}
          {event.eventType === 'ONLINE' ? 'Online' : 'Offline'}
        </span>
        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 shrink-0 text-[#ff7a45]" /> {formattedStartDate}</span>
        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 shrink-0 text-[#ff7a45]" /> {event.startTime} - {event.endTime} WIB</span>
        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 shrink-0 text-[#ff7a45]" /><span className="line-clamp-1">{event.location}</span></span>
      </div>
    </div>

    <div className="space-y-4">
      {event.banner && (
        <div className="relative aspect-[1.45] overflow-hidden rounded-[24px] border border-[#111927]/10 bg-[#11233f] shadow-[0_18px_50px_rgba(17,35,63,.08)]">
          <EventCover banner={event.banner} category={event.category?.name} coverStyle={coverStyle} title={event.title} />
        </div>
      )}
      <h2 className="font-display text-2xl font-extrabold tracking-[-.03em] text-[#11233f]">Detail Event</h2>
      <div
        className="prose min-h-37.5 max-w-none leading-relaxed text-[#4b5565] prose-headings:font-display prose-headings:text-[#11233f] prose-a:text-[#ff7a45] prose-strong:text-[#11233f]"
        dangerouslySetInnerHTML={{ __html: sanitizeEventDescription(event.description || '') }}
      />
    </div>
  </div>
);

export default EventInformation;
