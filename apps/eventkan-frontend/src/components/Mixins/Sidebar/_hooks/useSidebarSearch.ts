'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useMounted } from '@/hooks/useMounted';
import { usePermission } from '@/providers/PermissionProvider';

import { sideLinks } from '../_constants/sideLinks.constants';
import { filterSidebarLinks } from '../_libs/filterSidebarLinks.libs';

export function useSidebarSearch() {
  const isMounted = useMounted();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { permissions, hasRole } = usePermission();
  const tenantId = pathname.split('/')[2];
  const adminPath = tenantId ? `/admin/${tenantId}` : '/admin';

  useEffect(() => {
    if (!isMounted) return;

    setIsMac(navigator.userAgent.toLowerCase().includes('mac'));
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [isMounted]);

  const visibleLinks = filterSidebarLinks(
    sideLinks.navMain,
    permissions,
    hasRole('root_superadmin')
  );

  return { adminPath, isMac, isMounted, open, setOpen, visibleLinks };
}
