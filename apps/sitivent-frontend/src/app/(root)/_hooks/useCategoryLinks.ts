'use client';

import type { Route } from 'next';
import type { WheelEvent } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

export function useCategoryLinks(categoryCount: number) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const categoryNavRef = useRef<HTMLElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    const nav = categoryNavRef.current;
    if (!nav) return;

    const updateFades = () => {
      setShowLeftFade(nav.scrollLeft > 0);
      setShowRightFade(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1);
    };

    updateFades();
    nav.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);

    return () => {
      nav.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [categoryCount]);

  const handleCategoryWheel = (event: WheelEvent<HTMLElement>) => {
    const { currentTarget } = event;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta || currentTarget.scrollWidth <= currentTarget.clientWidth) return;

    event.preventDefault();
    currentTarget.scrollLeft += delta;
  };

  const createCategoryHref = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (categorySlug) params.set('category', categorySlug);
    else params.delete('category');

    const queryString = params.toString();
    return (queryString ? `/events?${queryString}` : '/events') as Route;
  };

  return {
    activeCategory,
    categoryNavRef,
    createCategoryHref,
    handleCategoryWheel,
    showLeftFade,
    showRightFade,
  };
}
