'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SearchForm } from '@/components/Mixins/Sidebar/SearchForm';

import { CMSBreadcrumbs } from './_components/CMSBreadcrumbs';

export function CMSHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-17.5 w-full shrink-0 items-center justify-between gap-2 border-b border-eventkan-ink/12 bg-eventkan-surface/92 px-4 backdrop-blur-xl md:px-7">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <CMSBreadcrumbs />
      </div>
      <SearchForm />
    </header>
  );
}
