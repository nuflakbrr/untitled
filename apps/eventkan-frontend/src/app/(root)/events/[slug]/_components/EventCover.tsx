'use client';

import type { FC } from 'react';

import { ZoomIn } from 'lucide-react';

import type { EventCoverProps } from '@/interfaces/features/events';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

const EventCover: FC<EventCoverProps> = ({ banner, category, coverStyle, title }) => {
  const fallback = (
    <div className={`relative flex h-full flex-col justify-between p-6 sm:p-8 ${coverStyle}`}>
      <span className="relative z-10 text-xs font-extrabold uppercase tracking-[.08em]">
        {category ?? 'Event'}
      </span>
      <h1 className="font-display relative z-10 max-w-[85%] text-[clamp(34px,5vw,68px)] font-extrabold leading-[.97] tracking-[-.045em] sm:max-w-[70%] lg:max-w-160">
        {title}
      </h1>
    </div>
  );

  if (!banner) return fallback;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative block h-full w-full cursor-zoom-in text-left"
          aria-label={`Perbesar cover ${title}`}
        >
          <img src={banner} alt={title} className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center bg-eventkan-navy/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-eventkan-surface px-4 py-2 text-sm font-bold text-eventkan-navy shadow-[0_12px_30px_rgba(17,35,63,.16)]">
              <ZoomIn className="h-4 w-4 text-eventkan-accent" />
              Perbesar cover
            </span>
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1rem)]! max-w-[calc(100vw-1rem)]! rounded-[26px] border border-eventkan-ink/10 bg-eventkan-surface p-3 shadow-[0_24px_70px_rgba(17,35,63,.16)] sm:w-[calc(100vw-2rem)]! sm:max-w-[calc(100vw-2rem)]! sm:p-4 lg:max-w-6xl!">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">Pratinjau cover event {title}</DialogDescription>
        <div className="relative flex max-h-[88vh] min-h-70 items-center justify-center overflow-hidden rounded-[18px] bg-eventkan-navy">
          <img src={banner} alt={title} className="max-h-[88vh] w-full object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventCover;
