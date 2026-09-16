'use client';

import type { FC } from 'react';

import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import { useMemo, useState, useEffect } from 'react';
import { Star, User, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

import type { TestimonialsCarouselProps } from '@/interfaces/features/testimonials';

import {
  Carousel,
  CarouselItem,
  CarouselContent,
  type CarouselApi,
} from '@/components/ui/carousel';

const TestimonialsCarousel: FC<TestimonialsCarouselProps> = ({ testimonials }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [_current, setCurrent] = useState(0);
  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false }),
    []
  );

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (!testimonials.length) return null;

  return (
    <section
      id="testimoni-peserta"
      className="relative overflow-hidden border-t border-eventkan-ink/10 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-295">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display max-w-190 text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-.04em]">
              Pengalaman yang ikut terbawa pulang.
            </h2>
            <p className="mt-5 max-w-155 text-[17px] leading-relaxed text-eventkan-muted">
              Cerita dari peserta yang sudah datang, terhubung, dan menikmati berbagai event kampus
              bersama EVENTKAN.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              className="grid h-10 w-10 place-items-center rounded-full border border-eventkan-navy text-eventkan-navy transition hover:-translate-y-0.5 hover:bg-eventkan-navy hover:text-white"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              className="grid h-10 w-10 place-items-center rounded-full border border-eventkan-navy text-eventkan-navy transition hover:-translate-y-0.5 hover:bg-eventkan-navy hover:text-white"
              aria-label="Berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Carousel
            opts={{ loop: true, align: 'start' }}
            plugins={[autoplayPlugin]}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((item) => (
                <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <article className="flex h-full flex-col justify-between rounded-[22px] border border-eventkan-ink/10 bg-eventkan-surface p-6 shadow-[0_2px_10px_rgba(17,35,63,.025)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(17,35,63,.045)]">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= item.rating ? 'fill-eventkan-accent text-eventkan-accent' : 'text-eventkan-ink/15'}`}
                            />
                          ))}
                        </div>
                        <Quote className="h-6 w-6 text-eventkan-accent/45" />
                      </div>

                      <p className="line-clamp-4 text-[17px] leading-relaxed text-eventkan-navy">
                        &ldquo;{item.comment}&rdquo;
                      </p>
                    </div>

                    <div className="mt-8 border-t border-eventkan-ink/10 pt-4">
                      <div className="flex items-center gap-3">
                        {item.user?.image ? (
                          <img
                            src={item.user.image}
                            alt={item.user.name || 'Peserta'}
                            loading="lazy"
                            className="h-9 w-9 shrink-0 rounded-full border border-eventkan-ink/10 object-cover"
                          />
                        ) : (
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-eventkan-peach text-xs font-bold text-eventkan-accent">
                            {item.user?.name ? (
                              item.user.name.charAt(0).toUpperCase()
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-eventkan-navy">
                            {item.user?.name || 'Peserta Event'}
                          </h3>
                          {item.event && (
                            <Link
                              href={`/events/${item.event.slug}`}
                              className="block truncate text-xs text-eventkan-muted hover:text-eventkan-accent hover:underline"
                            >
                              {item.event.title}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-eventkan-canvas to-transparent sm:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-eventkan-canvas to-transparent sm:w-16" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
