'use client';

import { Clock, Video, MapPin, Calendar, ArrowRight, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatLongDate } from '@/lib/formatLongDate';
import EmptyState from '@/components/Common/EmptyState';
import { formatEventTimeRange } from '@/lib/formatEventTimeRange';
import { getCoverStyles } from '@/app/(root)/_libs/getCoverStyles';

import ShowQrButton from './ShowQrButton';
import ConfirmOnlineButton from './ConfirmOnlineButton';

interface UpcomingEventCardProps {
  upcomingEvent: {
    id: string;
    title: string;
    banner: string | null;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    eventType?: string;
    meetingLink?: string | null;
    qrToken: string | null;
    status: string;
    registrationNumber?: string;
    onlineAttendance?: boolean;
  } | null;
}

export default function UpcomingEventCard({ upcomingEvent }: UpcomingEventCardProps) {
  const coverStyle = upcomingEvent ? getCoverStyles([upcomingEvent.id])[0] : '';

  return (
    <div>
      <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[#111927]/10 bg-[#fffdf8] shadow-[0_18px_50px_rgba(17,35,63,.05)]">
        <div className="flex items-center gap-2 border-b border-[#111927]/10 px-5 py-4">
          <Calendar className="h-4 w-4 text-[#ff7a45]" />
          <h2 className="font-display text-base font-extrabold text-[#111927]">Event Terdekat</h2>
        </div>

        <div className="flex flex-1 flex-col p-5">
          {upcomingEvent ? (
            <div className="space-y-5 flex-1">
              <div className="relative aspect-[1.5] w-full overflow-hidden rounded-[18px] bg-[#11233f]">
                {upcomingEvent.banner ? (
                  <img
                    src={upcomingEvent.banner}
                    alt={upcomingEvent.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className={`relative flex h-full flex-col justify-end p-5 ${coverStyle}`}>
                    <span className="relative z-10 text-[11px] font-extrabold uppercase tracking-[.08em]">
                      Event terdekat
                    </span>
                    <h3 className="font-display relative z-10 mt-2 max-w-[90%] text-2xl font-extrabold leading-[.98] tracking-[-.04em]">
                      {upcomingEvent.title}
                    </h3>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-display line-clamp-2 text-lg font-extrabold leading-snug tracking-[-.02em] text-[#111927]">
                  {upcomingEvent.title}
                </h3>

                <div className="space-y-2 text-xs text-[#6c7280]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-[#ff7a45]" />
                    <span>{formatLongDate(upcomingEvent.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-[#ff7a45]" />
                    <span>
                      {formatEventTimeRange(
                        upcomingEvent.startDate,
                        upcomingEvent.startTime,
                        upcomingEvent.endTime
                      ) || 'Waktu belum tersedia'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-[#ff7a45]" />
                    <span className="line-clamp-1">{upcomingEvent.location}</span>
                  </div>

                  {upcomingEvent.meetingLink && (
                    <Button
                      asChild
                      className="mt-1 w-full rounded-full bg-[#11233f] text-white hover:bg-[#1b3458]"
                    >
                      <a href={upcomingEvent.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="w-4 h-4 shrink-0" />
                        Gabung Link Event
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={AlertCircle}
              title="Belum ada event terdekat"
              description="Belum ada event terdekat yang kamu daftarkan."
              action={{ href: '/events', label: 'Jelajahi event', icon: ArrowRight }}
            />
          )}
        </div>

        {upcomingEvent && upcomingEvent.qrToken && upcomingEvent.eventType !== 'ONLINE' && (
          <div className="border-t border-[#111927]/10 px-5 pb-5 pt-0">
            <div className="pt-4">
              <ShowQrButton
                qrToken={upcomingEvent.qrToken}
                eventTitle={upcomingEvent.title}
                registrationNumber={upcomingEvent.registrationNumber}
                disabled={upcomingEvent.status === 'CHECKED_IN'}
              />
            </div>
          </div>
        )}

        {upcomingEvent &&
          upcomingEvent.eventType === 'ONLINE' &&
          upcomingEvent.onlineAttendance && (
            <div className="border-t border-[#111927]/10 px-5 pb-5 pt-0">
              <div className="pt-4">
                <ConfirmOnlineButton
                  registrationId={upcomingEvent.id}
                  disabled={upcomingEvent.status === 'CHECKED_IN'}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
