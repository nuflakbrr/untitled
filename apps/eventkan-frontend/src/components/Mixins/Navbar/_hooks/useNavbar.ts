'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getMeAction } from '@/services/public/auth';

export const useNavbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ['auth-me-server-action'],
    queryFn: getMeAction,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const session = data?.session;
  const isAdmin = data?.isAdmin ?? false;
  const tenantId = session?.tenantId;
  const dashboardHref = isAdmin
    ? tenantId
      ? `/admin/${tenantId}/dashboard`
      : '/admin'
    : '/participant/dashboard';
  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return {
    open,
    setOpen,
    session,
    isAdmin,
    tenantId,
    dashboardHref,
    isActive,
  };
};
