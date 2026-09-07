'use client';

import type { Route } from 'next';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef, type FC, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export const SearchBanner: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') || '';
  const [value, setValue] = useState(query);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync search input state if query parameter changes externally
  useEffect(() => {
    setValue(query);
  }, [query]);

  // Cleanup pending timer on unmount
  useEffect(() => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }, []);

  const updateUrl = useCallback(
    (newQuery: string) => {
      const currentQ = searchParams.get('q') || '';
      const trimmed = newQuery.trim();

      if (trimmed === currentQ) return;

      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set('q', trimmed);
      } else {
        params.delete('q');
      }
      params.delete('page');

      const queryString = params.toString();
      const targetUrl = (queryString ? `${pathname}?${queryString}` : pathname) as Route;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      updateUrl(val);
    }, 400);
  };

  const triggerSearch = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    updateUrl(value);
  };

  return (
    <div
      style={{ background: '#141413', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      className="py-28 px-6"
    >
      <div className="max-w-4xl mx-auto space-y-6 text-center flex flex-col items-center">
        <div className="space-y-2">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{
              color: '#D97757',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            }}
          >
            Event · Sitivent
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: '#FAF9F5' }}
          >
            Jelajahi Event Pilihan
          </h1>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#87867F' }}>
            Temukan seminar, workshop, dan webinar berkualitas yang sesuai dengan minat Anda.
          </p>
        </div>

        <div className="flex w-full max-w-md gap-2 relative pt-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Cari event atau lokasi..."
              value={value}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
              className="w-full pl-10 h-11 rounded-xl shadow-xs border-none text-white placeholder:text-[#87867F]"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#87867F] pointer-events-none" />
          </div>
          <Button
            onClick={triggerSearch}
            className="h-11 px-6 rounded-xl font-semibold text-white cursor-pointer"
            style={{ background: '#D97757' }}
          >
            Cari
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBanner;
