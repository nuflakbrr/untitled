'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import type { Gallery } from '@/interfaces/features/galleries';

import { getPublicGalleriesAction } from '@/services/public/search';

const PAGE_SIZE = 8;

const withImage = (items: Gallery[]) => items.filter((item) => item.imageUrl?.trim());

export const useGalleryPagination = (initialItems: Gallery[]) => {
  const [items, setItems] = useState<Gallery[]>(() => withImage(initialItems));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialItems.length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadNextPage = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const newItems = await getPublicGalleriesAction(nextPage, PAGE_SIZE);

      if (newItems.length < PAGE_SIZE) setHasMore(false);
      if (newItems.length > 0) {
        setItems((currentItems) => [...currentItems, ...withImage(newItems as Gallery[])]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    if (!hasMore || !observerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadNextPage();
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

  return { hasMore, items, loading, observerRef };
};
