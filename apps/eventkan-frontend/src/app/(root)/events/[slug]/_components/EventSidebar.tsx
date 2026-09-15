import type { FC } from 'react';

import { User, Clock, Users, Landmark, Briefcase, BadgeAlert, ExternalLink } from 'lucide-react';

import type { EventSpeaker, EventSidebarProps } from '@/interfaces/features/events';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/formatCurrency';
import { Card, CardContent } from '@/components/ui/card';
import { GitHubIcon, LinkedInIcon, InstagramIcon } from '@/components/Common/CustomIcons';

import RegisterButton from './RegisterButton';

const cardClass = 'overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] py-0 shadow-[0_18px_50px_rgba(17,35,63,.04)] ring-0';
const labelClass = 'text-[11px] font-extrabold uppercase tracking-[.08em] text-[#6c7280]';

const EventSidebar: FC<EventSidebarProps> = ({
  event,
  formattedDeadline,
  isAuthenticated,
  isDeadlinePassed,
  isEmailVerified,
  isFree,
  isQuotaFull,
  isRegistered,
  registrationStatus,
  slotsLeft,
}) => (
  <div className="space-y-4 self-start lg:sticky lg:top-28 lg:col-span-1">
    <Card className={cardClass}>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-1">
          <span className={labelClass}>Biaya Pendaftaran</span>
          <span className={`font-display block text-3xl font-extrabold ${isFree ? 'text-[#36784b]' : 'text-[#11233f]'}`}>
            {isFree ? 'Gratis' : formatCurrency(event.price)}
          </span>
        </div>
        <Separator className="bg-[#111927]/10" />
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-[#6c7280]"><Users className="h-4 w-4 text-[#ff7a45]" /> Sisa Kuota</span>
            <span className="font-bold text-[#11233f]">{slotsLeft} kursi</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-[#6c7280]"><Clock className="h-4 w-4 text-[#ff7a45]" /> Batas pendaftaran</span>
            <span className="text-right font-bold text-[#11233f]">{formattedDeadline}</span>
          </div>
        </div>
        <div className="pt-2">
          {event.status !== 'PUBLISHED' ? (
            <Button disabled className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#f6f3eb] py-6 text-xs font-bold uppercase tracking-wider text-[#6c7280]">
              <BadgeAlert className="h-5 w-5" /> Pendaftaran Ditutup
            </Button>
          ) : (
            <RegisterButton
              eventId={event.id}
              isAuthenticated={isAuthenticated}
              isEmailVerified={isEmailVerified}
              isRegistered={isRegistered}
              registrationStatus={registrationStatus}
              isDeadlinePassed={isDeadlinePassed}
              isQuotaFull={isQuotaFull}
              price={event.price}
              slug={event.slug}
            />
          )}
        </div>
      </CardContent>
    </Card>

    {event.createdBy && (
      <Card className={cardClass}>
        <CardContent className="space-y-3 p-6">
          <span className={labelClass}>Diselenggarakan Oleh</span>
          <div className="mt-2 flex items-center gap-3">
            {event.createdBy.image ? <img src={event.createdBy.image} alt={event.createdBy.name || 'Penyelenggara'} className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe5d8] text-[#ff7a45]"><User className="h-5 w-5" /></div>}
            <p className="text-sm font-bold text-[#11233f]">{event.createdBy.name || 'EVENTKAN'}</p>
          </div>
        </CardContent>
      </Card>
    )}

    {event.speakers.length > 0 && (
      <Card className={cardClass}>
        <CardContent className="space-y-4 p-6">
          <span className={labelClass}>Pemateri</span>
          <div className="mt-2 space-y-4">
            {event.speakers.map((speaker, index) => <Speaker key={speaker.id || index} speaker={speaker} />)}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

const Speaker: FC<{ speaker: EventSpeaker }> = ({ speaker }) => (
  <div className="flex gap-3">
    {speaker.avatar ? <img src={speaker.avatar} alt={speaker.name ?? 'Pemateri'} className="h-12 w-12 shrink-0 rounded-full object-cover" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e5f2e8] text-[#36784b]"><User className="h-5 w-5" /></div>}
    <div className="min-w-0 space-y-1">
      <p className="text-sm font-bold text-[#11233f]">{speaker.name}</p>
      {speaker.title && <p className="flex items-center gap-1 text-xs text-[#6c7280]"><Briefcase className="h-3 w-3" /> {speaker.title}</p>}
      {speaker.company && <div className="flex items-center gap-1"><Landmark className="h-3 w-3 text-[#6c7280]" />{speaker.companyUrl ? <a href={speaker.companyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-[11px] text-[#6c7280] hover:text-[#ff7a45] hover:underline">{speaker.company}<ExternalLink className="h-3 w-3" /></a> : <p className="text-xs text-[#6c7280]">{speaker.company}</p>}</div>}
      <div className="flex flex-wrap gap-2 pt-1">
        {speaker.github && <a href={speaker.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-[11px] text-[#11233f] hover:underline"><GitHubIcon className="h-3 w-3" /> GitHub</a>}
        {speaker.instagram && <a href={speaker.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-[11px] text-[#ff7a45] hover:underline"><InstagramIcon className="h-3 w-3" /> Instagram</a>}
        {speaker.linkedIn && <a href={speaker.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-[11px] text-[#1d4ed8] hover:underline"><LinkedInIcon className="h-3 w-3" /> LinkedIn</a>}
      </div>
    </div>
  </div>
);

export default EventSidebar;
