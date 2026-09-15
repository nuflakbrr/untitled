'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export const useDebounce = <T>(initialValue: T, delay = 300): [T, (value: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const setDebouncedHandler = useCallback(
    (newValue: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setDebouncedValue(newValue);
      }, delay);
    },
    [delay]
  );

  useEffect(() => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }, []);

  return [debouncedValue, setDebouncedHandler];
};
