import type { Metadata } from 'next';

import { notFound } from 'next/navigation';
import {
  User,
  Clock,
  Users,
  Globe,
  icons,
  MapPin,
  Calendar,
  Landmark,
  Sparkles,
  Briefcase,
  BadgeAlert,
  ExternalLink,
} from 'lucide-react';

import type {
  EventBenefit,
  EventSpeaker,
  EventDetailPageProps,
} from '@/interfaces/features/events';

import { genPageMetadata } from '@/app/seo';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatCurrency';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { getPublicEventBySlug } from '@/services/public/events';
import { GitHubIcon, LinkedInIcon, InstagramIcon } from '@/components/Common/CustomIcons';

import RegisterButton from './_components/RegisterButton';
import { getEventPageData } from './_libs/getEventPageData';
import { getCoverStyles } from '../../_libs/getCoverStyles';
import EventTestimonials from './_components/EventTestimonials';

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) {
    return genPageMetadata({ title: 'Event Tidak Ditemukan' });
  }

  return genPageMetadata({
    title: event.title,
    description: event.description.replace(/<[^>]*>/g, '').substring(0, 160),
    image: event.banner ?? undefined,
  });
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const pageData = await getEventPageData(slug);

  if (!pageData) return notFound();

  const {
    event,
    formattedDeadline,
    formattedStartDate,
    isAuthenticated,
    isDeadlinePassed,
    isEmailVerified,
    isFree,
    isQuotaFull,
    isRegistered,
    registrationStatus,
    slotsLeft,
    totalRegistered,
  } = pageData;
  const coverStyle = getCoverStyles([event.id])[0];

  return (
    <article className="min-h-screen bg-[#f6f3eb] pt-24 pb-20 text-[#11233f] antialiased sm:pt-28">
      <div className="mx-auto max-w-295 px-4 md:px-0">
        <div
          className={`relative mb-8 aspect-video w-full overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(17,35,63,.08)] md:aspect-3/1 ${coverStyle}`}
        >
          <div className="relative flex h-full w-full flex-col justify-between p-6 sm:p-8 lg:p-10">
            <span className="relative z-10 text-xs font-extrabold uppercase tracking-[.08em]">
              {event.category?.name ?? 'Event'}
            </span>
            <h1 className="font-display relative z-10 max-w-[85%] text-[clamp(34px,5vw,68px)] font-extrabold leading-[.97] tracking-[-.045em] sm:max-w-[70%] lg:max-w-160">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          {/* Left Column: Title & Description (col-span-2) */}
          <div className="space-y-10 lg:col-span-2">
            <div className="space-y-4">
              {/* <h1 className="font-display text-3xl font-extrabold leading-[1.02] tracking-[-.04em] text-[#11233f] md:text-5xl">
                {event.title}
              </h1> */}
              <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#6c7280]">
                <span className="flex items-center gap-1.5">
                  {event.eventType === 'ONLINE' ? (
                    <Globe className="h-4 w-4 shrink-0 text-[#ff7a45]" />
                  ) : (
                    <Landmark className="h-4 w-4 shrink-0 text-[#ff7a45]" />
                  )}
                  {event.eventType === 'ONLINE' ? 'Online' : 'Offline'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0 text-[#ff7a45]" /> {formattedStartDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 shrink-0 text-[#ff7a45]" /> {event.startTime} -{' '}
                  {event.endTime} WIB
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#ff7a45]" />
                  <span className="line-clamp-1">{event.location}</span>
                </span>
              </div>
            </div>

            <Separator className="bg-[#111927]/10" />

            {/* Description HTML content */}
            <div className="space-y-4">
              <div className="relative aspect-[1.45] overflow-hidden rounded-[24px] border border-[#111927]/10 bg-[#11233f] shadow-[0_18px_50px_rgba(17,35,63,.08)]">
                {event.banner ? (
                  <img
                    src={event.banner}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`relative flex h-full flex-col justify-between p-6 sm:p-8 ${coverStyle}`}
                  >
                    <span className="relative z-10 text-xs font-extrabold uppercase tracking-[.08em]">
                      {event.category?.name ?? 'Event'}
                    </span>
                    <h1 className="font-display relative z-10 max-w-[85%] text-[clamp(34px,5vw,68px)] font-extrabold leading-[.97] tracking-[-.045em] sm:max-w-[70%] lg:max-w-160">
                      {event.title}
                    </h1>
                  </div>
                )}
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-[-.03em] text-[#11233f]">
                Detail Event
              </h2>
              <div
                className="prose min-h-37.5 max-w-none leading-relaxed text-[#4b5565] prose-headings:font-display prose-headings:text-[#11233f] prose-a:text-[#ff7a45] prose-strong:text-[#11233f]"
                dangerouslySetInnerHTML={{
                  __html: (event.description || '').replace(
                    /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi,
                    (match: string, href: string) => {
                      const trimmed = href.trim();
                      const formattedHref = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmed)
                        ? trimmed
                        : `https://${trimmed}`;
                      let tag = match.replace(href, formattedHref);
                      if (!/target=/i.test(tag)) {
                        tag = tag.replace(/<a\b/i, '<a target="_blank" rel="noopener noreferrer"');
                      }
                      return tag;
                    }
                  ),
                }}
              />
            </div>

            {/* Benefits Section */}
            {event.benefits.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-extrabold tracking-[-.03em] text-[#11233f]">
                  Benefit Event
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {event.benefits.map((benefit: EventBenefit, idx: number) => (
                    <div
                      key={benefit.id || idx}
                      className="flex items-start gap-3 rounded-[18px] border border-[#111927]/10 bg-[#fffdf8] p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffe5d8] text-[#ff7a45]">
                        {(() => {
                          if (!benefit.icon) return <Sparkles className="h-4 w-4" />;
                          const pascalName = benefit.icon
                            .trim()
                            .replace(/(^\w|-\w)/g, (m: string) => m.replace('-', '').toUpperCase());
                          const IconComponent =
                            icons[pascalName as keyof typeof icons] ||
                            icons[benefit.icon as keyof typeof icons];
                          return IconComponent ? (
                            <IconComponent className="h-4 w-4" />
                          ) : (
                            <Sparkles className="h-4 w-4" />
                          );
                        })()}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#11233f]">{benefit.title}</p>
                        {benefit.description && (
                          <p className="text-xs leading-relaxed text-[#6c7280]">
                            {benefit.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-[#111927]/10" />

            {/* Testimonials Section */}
            <EventTestimonials eventId={event.id} />
          </div>

          {/* Right Column: Pricing & Registration (col-span-1) */}
          <div className="space-y-4 self-start lg:sticky lg:top-28 lg:col-span-1">
            <Card className="overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] py-0 shadow-[0_18px_50px_rgba(17,35,63,.04)] ring-0">
              <CardContent className="space-y-6 p-6">
                {/* Price block */}
                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#6c7280]">
                    Biaya Pendaftaran
                  </span>
                  <div className="flex items-baseline gap-1">
                    {isFree ? (
                      <span className="font-display text-3xl font-extrabold text-[#36784b]">
                        Gratis
                      </span>
                    ) : (
                      <span className="font-display text-3xl font-extrabold text-[#11233f]">
                        {formatCurrency(event.price)}
                      </span>
                    )}
                  </div>
                </div>

                <Separator className="bg-[#111927]/10" />

                {/* Key stats details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-[#6c7280]">
                      <Users className="h-4 w-4 text-[#ff7a45]" /> Sisa Kuota
                    </span>
                    <span className="font-bold text-[#11233f]">{slotsLeft} kursi</span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-[#6c7280]">
                      <Clock className="h-4 w-4 text-[#ff7a45]" /> Batas pendaftaran
                    </span>
                    <span className="text-right font-bold text-[#11233f]">{formattedDeadline}</span>
                  </div>
                </div>

                {/* Register Action Button */}
                <div className="pt-2">
                  {event.status !== 'PUBLISHED' ? (
                    <Button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#f6f3eb] py-6 text-xs font-bold uppercase tracking-wider text-[#6c7280]"
                    >
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

            {/* Creator Card */}
            {event.createdBy && (
              <Card className="overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] py-0 shadow-[0_18px_50px_rgba(17,35,63,.04)] ring-0">
                <CardContent className="space-y-3 p-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#6c7280]">
                    Diselenggarakan Oleh
                  </span>
                  <div className="mt-2 flex items-center gap-3">
                    {event.createdBy.image ? (
                      <img
                        src={event.createdBy.image}
                        alt={event.createdBy.name || 'Penyelenggara'}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe5d8] text-[#ff7a45]">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <p className="text-sm font-bold text-[#11233f]">
                      {event.createdBy.name || 'SITIVENT'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Speakers Card */}
            {event.speakers.length > 0 && (
              <Card className="overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] py-0 shadow-[0_18px_50px_rgba(17,35,63,.04)] ring-0">
                <CardContent className="space-y-4 p-6">
                  <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-[#6c7280]">
                    Pemateri
                  </span>
                  <div className="mt-2 space-y-4">
                    {event.speakers.map((speaker: EventSpeaker, idx: number) => (
                      <div key={speaker.id || idx} className="flex gap-3">
                        {speaker.avatar ? (
                          <img
                            src={speaker.avatar ?? undefined}
                            alt={speaker.name ?? 'Pemateri'}
                            className="h-12 w-12 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e5f2e8] text-[#36784b]">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm font-bold text-[#11233f]">{speaker.name}</p>
                          {speaker.title && (
                            <p className="flex items-center gap-1 text-xs text-[#6c7280]">
                              <Briefcase className="h-3 w-3" /> {speaker.title}
                            </p>
                          )}
                          {speaker.company && (
                            <div className="flex items-center gap-1">
                              <Landmark className="h-3 w-3" />{' '}
                              {speaker.companyUrl ? (
                                <a
                                  href={speaker.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-0.5 text-[11px] text-[#6c7280] hover:text-[#ff7a45] hover:underline"
                                >
                                  {speaker.company}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <p className="text-xs text-[#6c7280]">{speaker.company}</p>
                              )}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {speaker.github && (
                              <a
                                href={speaker.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-[11px] text-[#11233f] hover:underline"
                              >
                                <GitHubIcon className="w-3 h-3" /> GitHub
                              </a>
                            )}
                            {speaker.instagram && (
                              <a
                                href={speaker.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-[11px] text-[#ff7a45] hover:underline"
                              >
                                <InstagramIcon className="h-3 w-3" /> Instagram
                              </a>
                            )}
                            {speaker.linkedIn && (
                              <a
                                href={speaker.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1D4ED8] hover:underline flex items-center gap-0.5 text-[11px]"
                              >
                                <LinkedInIcon className="h-3 w-3" /> LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
