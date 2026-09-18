'use client';

import type { ComponentProps } from 'react';

import type { AdminSessionContext } from '@/interfaces/features/auth';

import { Sidebar, SidebarRail, SidebarFooter, SidebarContent } from '@/components/ui/sidebar';

import { UserSetting } from './UserSetting';
import { SidebarBrand } from './_components/SidebarBrand';
import { useAdminSidebar } from './_hooks/useAdminSidebar';
import { SidebarLoading } from './_components/SidebarLoading';
import { SidebarNavigation } from './_components/SidebarNavigation';

export function AppSidebar({
  session,
  permissions,
  ...props
}: ComponentProps<typeof Sidebar> & {
  session: AdminSessionContext;
  permissions: string[];
}) {
  const sidebar = useAdminSidebar(session, permissions);

  if (!sidebar.isMounted) return <SidebarLoading {...props} />;

  return (
    <Sidebar
      {...props}
      className="border-eventkan-ink/12 bg-eventkan-surface [--sidebar:var(--eventkan-surface)] [--sidebar-accent:var(--eventkan-peach)] [--sidebar-accent-foreground:var(--eventkan-peach-ink)] [--sidebar-border:rgb(17_25_39_/_12%)] [--sidebar-foreground:var(--eventkan-ink)] [--sidebar-primary:var(--eventkan-navy)] [--sidebar-primary-foreground:#fff]"
    >
      <SidebarBrand
        tenants={sidebar.tenants}
        activeTenantId={sidebar.tenantId}
        isRootSuperadmin={sidebar.isRootSuperadmin}
        onSwitch={sidebar.switchTenant}
      />
      <SidebarContent className="gap-0">
        <SidebarNavigation
          items={sidebar.visibleLinks}
          adminPath={sidebar.adminPath}
          onNavigate={sidebar.closeSidebar}
        />
      </SidebarContent>
      <SidebarFooter className="border-t border-eventkan-ink/12 pt-3">
        <UserSetting user={sidebar.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
