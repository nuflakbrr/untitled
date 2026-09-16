import dynamic from 'next/dynamic';

import type { Event } from '@/interfaces/features/events';

import { genPageMetadata } from '@/app/seo';
import { getPublicEvents } from '@/services/public/events';
import { getFeaturedTestimonials } from '@/services/public/testimonials';
import { getPublicEventCategories } from '@/services/public/event-categories';

import Features from './_components/Features';
import HeroBanner from './_components/HeroBanner';
import GalleryBento from './_components/GalleryBento';
import FeaturedEvents from './_components/FeaturedEvents';
import TestimonialsCarousel from './_components/TestimonialsCarousel';

const CTABanner = dynamic(() => import('./_components/CTABanner'));

export const metadata = genPageMetadata({
  title: 'Platform Manajemen Event & Tiket',
  description:
    'Temukan dan daftar seminar, workshop, webinar, serta bootcamp teknologi terbaik di Indonesia. Satu platform untuk semua event.',
});

export default async function HomePage() {
  const [events, categories, testimonials] = await Promise.all([
    getPublicEvents(),
    getPublicEventCategories(),
    getFeaturedTestimonials(10),
  ]);

  return (
    <div className="w-full bg-eventkan-canvas text-eventkan-ink">
      <HeroBanner events={events.slice(0, 5) as Event[]} />
      <FeaturedEvents events={events} categories={categories} />
      <GalleryBento />
      <Features />
      <TestimonialsCarousel testimonials={testimonials} />
      <CTABanner />
    </div>
  );
}
