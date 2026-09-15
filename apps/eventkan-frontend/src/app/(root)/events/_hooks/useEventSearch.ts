'use client';

import type { Route } from 'next';
import type { ChangeEvent } from 'react';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function useEventSearch({ categoryCount }: { categoryCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const activeCategory = searchParams.get('category');
  const [value, setValue] = useState(query);
  const categoryNavRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  useEffect(() => setValue(query), [query]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const updateUrl = useCallback(
    (nextQuery: string) => {
      const trimmedQuery = nextQuery.trim();
      if (trimmedQuery === query) return;

      const params = new URLSearchParams(searchParams.toString());
      if (trimmedQuery) params.set('q', trimmedQuery);
      else params.delete('q');
      params.delete('page');

      const queryString = params.toString();
      router.replace((queryString ? `${pathname}?${queryString}` : pathname) as Route, {
        scroll: false,
      });
    },
    [pathname, query, router, searchParams]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => updateUrl(nextValue), 400);
  };

  const submitSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    updateUrl(value);
  };

  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (slug) params.set('category', slug);
    else params.delete('category');

    const queryString = params.toString();
    return (queryString ? `${pathname}?${queryString}` : pathname) as Route;
  };

  return {
    activeCategory,
    categoryHref,
    categoryNavRef,
    handleInputChange,
    showLeftFade,
    showRightFade,
    submitSearch,
    value,
  };
}
