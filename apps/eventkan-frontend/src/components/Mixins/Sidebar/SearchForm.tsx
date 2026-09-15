'use client';

import type { Route } from 'next';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { SidebarInput } from '@/components/ui/sidebar';

import { useSidebarSearch } from './_hooks/useSidebarSearch';
import { SidebarSearchCommand } from './_components/SidebarSearchCommand';

export function SearchForm() {
  const router = useRouter();
  const { adminPath, isMac, isMounted, open, setOpen } = useSidebarSearch();

  if (!isMounted) return <div className="h-8 w-40 animate-pulse rounded-md bg-sidebar-accent" />;

  return (
    <>
      <div className="relative">
        <Label htmlFor="search" className="sr-only">Search</Label>
        <SidebarInput
          id="search"
          onClick={() => setOpen(true)}
          readOnly
          placeholder="Cari Menu..."
          className="cursor-pointer pl-8 pr-12 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        <kbd className="pointer-events-none absolute top-1/2 right-2 flex h-5 -translate-y-1/2 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>+ K
        </kbd>
      </div>
      <SidebarSearchCommand
        open={open}
        onOpenChange={setOpen}
        onNavigate={(url) => {
          router.push(`${adminPath}/${url}` as Route);
          setOpen(false);
        }}
      />
    </>
  );
}
