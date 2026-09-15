import { useRef, useMemo, useState, useEffect } from 'react';

import type { ArticleItem } from '@/interfaces/features/articles';

import { useDebounce } from '@/hooks/useDebounce';

import { getCoverStyles } from '../../_libs/getCoverStyles';

export const useArticlesGrid = (
  initialItems: ArticleItem[],
  availableCategories: string[]
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce('', 500);
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const categoryListRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const categories = useMemo(
    () => ['Semua', ...new Set(availableCategories.filter(Boolean))],
    [availableCategories]
  );

  const filteredItems = useMemo(() => {
    const query = debouncedSearchTerm.toLowerCase();

    return initialItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      const matchesCategory =
        categoryFilter === 'Semua' ||
        item.categories?.includes(categoryFilter) ||
        item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, debouncedSearchTerm, initialItems]);

  const coverStyles = useMemo(
    () => getCoverStyles(filteredItems.map((item) => item.id)),
    [filteredItems]
  );

  useEffect(() => {
    const categoryList = categoryListRef.current;
    if (!categoryList) return;

    const updateFades = () => {
      setShowLeftFade(categoryList.scrollLeft > 0);
      setShowRightFade(
        categoryList.scrollLeft + categoryList.clientWidth < categoryList.scrollWidth - 1
      );
    };

    updateFades();
    categoryList.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);

    return () => {
      categoryList.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [categories.length]);

  return {
    categoryFilter,
    categoryListRef,
    categories,
    coverStyles,
    featured: filteredItems[0],
    remainingItems: filteredItems.slice(1),
    searchTerm,
    setCategoryFilter,
    showLeftFade,
    showRightFade,
    updateSearch: (value: string) => {
      setSearchTerm(value);
      setDebouncedSearchTerm(value);
    },
  };
};
