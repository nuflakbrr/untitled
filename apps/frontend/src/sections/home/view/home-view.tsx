'use client';

import type { PublicEvent, PublicGallery, PublicCategory } from 'src/lib/api/events';

import { useState, useEffect } from 'react';

import { Hero } from '../home-hero';
import { Stats } from '../home-stats';
import { Gallery } from '../home-gallery';
import { Benefits } from '../home-benefits';
import { FinalCta } from '../home-final-cta';
import { CategoryFilter } from '../home-category-filter';
import { FeaturedEvents } from '../home-featured-events';

export function HomeView({
  events,
  categories,
  galleries,
  isAuthenticated = false,
}: {
  events: PublicEvent[];
  categories: PublicCategory[];
  galleries: PublicGallery[];
  isAuthenticated?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeEvent = events[activeIndex % Math.max(events.length, 1)];
  useEffect(() => {
    if (events.length < 2) return undefined;
    const timer = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % events.length),
      7000
    );
    return () => window.clearInterval(timer);
  }, [events.length]);
  return (
    <>
      <Hero
        event={activeEvent}
        isAuthenticated={isAuthenticated}
        total={events.length}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />
      <CategoryFilter categories={categories} />
      <FeaturedEvents events={events} />
      <Stats events={events} />
      <Gallery galleries={galleries} />
      <Benefits />
      <FinalCta />
    </>
  );
}
