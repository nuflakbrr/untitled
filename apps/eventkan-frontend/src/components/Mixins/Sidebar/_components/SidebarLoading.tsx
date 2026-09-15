import type { ComponentProps } from 'react';

import { Sidebar, SidebarRail, SidebarGroup } from '@/components/ui/sidebar';

export function SidebarLoading(props: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarGroup>
        <div className="flex h-25 items-center justify-center px-4">
          <div className="h-8 w-32 animate-pulse rounded-md bg-sidebar-accent" />
        </div>
        <div className="space-y-2 p-2">
          <div className="h-8 w-full animate-pulse rounded-md bg-sidebar-accent" />
          <div className="h-8 w-full animate-pulse rounded-md bg-sidebar-accent" />
        </div>
      </SidebarGroup>
      <SidebarRail />
    </Sidebar>
  );
}
