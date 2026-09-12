import type { Metadata } from 'next';

import dynamic from 'next/dynamic';

import type { Event } from '@/interfaces/features/events';

import { getPublicEvents } from '@/services/admin/events';
import { getFeaturedTestimonials } from '@/services/public/testimonials';
import { getPublicEventCategories } from '@/services/admin/event-categories';

import Features from './_components/Features';
import HeroBanner from './_components/HeroBanner';
import GalleryBento from './_components/GalleryBento';
import FeaturedEvents from './_components/FeaturedEvents';
import TestimonialsCarousel from './_components/TestimonialsCarousel';

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

  return (
    <div className="w-full bg-[#f6f3eb] text-[#111927]">
      <HeroBanner events={events.slice(0, 5) as Event[]} />
      <FeaturedEvents events={events} categories={categories} />
      <GalleryBento />
      <Features />
      <TestimonialsCarousel testimonials={testimonials} />
      <CTABanner />
    </div>
  );
}
