'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useMounted } from '@/hooks/useMounted';

export function useSidebarSearch() {
  const isMounted = useMounted();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
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

  return { adminPath, isMac, isMounted, open, setOpen };
}
