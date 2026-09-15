'use client';

import type { ComponentProps } from 'react';

import type { AdminSessionContext } from '@/interfaces/features/auth';

import {
  Sidebar,
  SidebarRail,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';

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
    <Sidebar {...props}>
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
      <SidebarFooter>
        <UserSetting user={sidebar.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
