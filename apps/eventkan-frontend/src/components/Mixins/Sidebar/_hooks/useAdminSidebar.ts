'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import type { AdminSessionContext } from '@/interfaces/features/auth';

import { useMounted } from '@/hooks/useMounted';
import { getMyTenantsAction } from '@/services/public/auth';

import { sideLinks } from '../_constants/sideLinks';
import { filterSidebarLinks } from '../_libs/filterSidebarLinks';

const BASE_ADMIN_PATH = '/admin';

export function useAdminSidebar(session: AdminSessionContext, permissions: string[]) {
  const isMounted = useMounted();
  const pathname = usePathname();
  const tenantId = pathname.split('/')[2] ?? '';
  const adminPath = tenantId ? `${BASE_ADMIN_PATH}/${tenantId}` : BASE_ADMIN_PATH;
  const { data: tenants = [] } = useQuery({
    queryKey: ['my-tenants'],
    queryFn: getMyTenantsAction,
    staleTime: 5 * 60 * 1000,
  });
  const isRootSuperadmin = (session.roles ?? []).some(
    (role) => role.toLowerCase() === 'root_superadmin'
  );

  React.useEffect(() => {
    const closeSidebar = () => {
      if (window.innerWidth >= 768) return;
      const trigger = document.querySelector(
        '[data-sidebar] button[aria-label="Toggle Sidebar"]'
      ) as HTMLButtonElement | null;
      trigger?.click();
    };

    document.addEventListener('close-sidebar', closeSidebar);
    return () => document.removeEventListener('close-sidebar', closeSidebar);
  }, []);

  return {
    adminPath,
    isMounted,
    isRootSuperadmin,
    tenantId,
    tenants,
    user: {
      name: session.user.name || 'User',
      email: session.user.email || '...',
      avatar: session.user.image || '',
    },
    visibleLinks: filterSidebarLinks(sideLinks.navMain, permissions, isRootSuperadmin),
    closeSidebar: () => document.dispatchEvent(new Event('close-sidebar')),
    switchTenant: (nextTenantId: string) => {
      document.cookie = `eventkan_active_tenant=${encodeURIComponent(nextTenantId)}; path=/; samesite=lax`;
      window.location.assign(`/admin/${nextTenantId}/dashboard`);
    },
  };
}
