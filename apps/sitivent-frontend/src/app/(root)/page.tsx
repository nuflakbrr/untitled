import type { Metadata } from 'next';
import type { Event } from '@/interfaces/features/events';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getPublicEvents } from '@/services/admin/events';
import { getFeaturedTestimonials } from '@/services/public/testimonials';
import { getPublicEventCategories } from '@/services/admin/event-categories';

import Stats from './_components/Stats';
import HeroBanner from './_components/HeroBanner';
import CategoryLinks from './_components/CategoryLinks';
import FeaturedEvents from './_components/FeaturedEvents';

const GalleryBento = dynamic(() => import('./_components/GalleryBento'));
const Features = dynamic(() => import('./_components/Features'));
const TestimonialsCarousel = dynamic(() => import('./_components/TestimonialsCarousel'));
const CTABanner = dynamic(() => import('./_components/CTABanner'));

export const metadata: Metadata = {
  title: 'SITIVENT — Platform Manajemen Event & Tiket',
  description:
    'Temukan dan daftar seminar, workshop, webinar, serta bootcamp teknologi terbaik di Indonesia. Satu platform untuk semua event.',
};

export default async function HomePage() {
  const [events, categories, testimonials] = await Promise.all([
    getPublicEvents(),
    getPublicEventCategories(),
    getFeaturedTestimonials(10),
  ]);

  // Take minimum 3 and maximum 5 for HeroBanner, fallback if fewer
  const heroEvents = events.slice(0, 5);

  return (
    <div className="w-full">
      <HeroBanner events={heroEvents as Event[]} />
      <Suspense fallback={<div className="h-14 border-b bg-white" />}>
        <CategoryLinks categories={categories} />
      </Suspense>
      <FeaturedEvents events={events} />
      <Stats />
      <GalleryBento />
      <Features />
      <TestimonialsCarousel testimonials={testimonials} />
      <CTABanner />
    </div>
  );
}
