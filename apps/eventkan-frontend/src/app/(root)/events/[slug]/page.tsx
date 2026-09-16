import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import type { EventDetailPageProps } from '@/interfaces/features/events';

import { genPageMetadata } from '@/app/seo';
import { getPublicEventBySlug } from '@/services/public/events';

import EventSidebar from './_components/EventSidebar';
import EventBenefits from './_components/EventBenefits';
import { getEventPageData } from './_libs/getEventPageData.libs';
import { getCoverStyles } from '../../_libs/getCoverStyles.libs';
import EventInformation from './_components/EventInformation';
import EventTestimonials from './_components/EventTestimonials';

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);

  if (!event) return genPageMetadata({ title: 'Event Tidak Ditemukan' });

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

  const { event, ...detail } = pageData;
  const coverStyle = getCoverStyles([event.id])[0];

  return (
    <article className="min-h-screen bg-eventkan-canvas pb-20 pt-24 text-eventkan-navy antialiased sm:pt-28">
      <div className="mx-auto max-w-295 px-4 md:px-0">
        <div className={`relative mb-8 aspect-video w-full overflow-hidden rounded-[28px] shadow-[0_18px_50px_rgba(17,35,63,.08)] md:aspect-3/1 ${coverStyle}`}>
          <div className="relative flex h-full w-full flex-col justify-between p-6 sm:p-8 lg:p-10">
            <span className="relative z-10 text-xs font-extrabold uppercase tracking-[.08em]">{event.category?.name ?? 'Event'}</span>
            <h1 className="font-display relative z-10 max-w-[85%] text-[clamp(34px,5vw,68px)] font-extrabold leading-[.97] tracking-[-.045em] sm:max-w-[70%] lg:max-w-160">{event.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-4">
          <div className="space-y-10 lg:col-span-2">
            <EventInformation event={event} formattedStartDate={detail.formattedStartDate} coverStyle={coverStyle} />
            <EventBenefits benefits={event.benefits} />
            <div className="border-t border-eventkan-ink/10 pt-10">
              <EventTestimonials eventId={event.id} />
            </div>
          </div>
          <EventSidebar {...detail} event={event} />
        </div>
      </div>
    </article>
  );
}
