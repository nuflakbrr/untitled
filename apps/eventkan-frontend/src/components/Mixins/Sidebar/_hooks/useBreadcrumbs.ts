'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';

import { resolveLabel } from '@/services/admin/labels';

import {
  isUUID,
  breadcrumbLabels,
  resolvableBreadcrumbParents,
} from '../_constants/breadcrumbs.constants';

export function useBreadcrumbs() {
  const pathname = usePathname();
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>({});
  const rawSegments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const tenantId =
    rawSegments[0] === 'admin' && isUUID(rawSegments[1] ?? '') ? rawSegments[1] : null;
  const pathSegments = useMemo(
    () => rawSegments.filter((segment, index) => !(index === 1 && tenantId && segment === tenantId)),
    [rawSegments, tenantId]
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchLabels() {
      const labels: Record<string, string> = {};

      for (let index = 0; index < pathSegments.length; index += 1) {
        const segment = pathSegments[index];
        const parent = pathSegments[index - 1];

        if (breadcrumbLabels[segment] || resolvedLabels[segment]) continue;
        if (!parent || !resolvableBreadcrumbParents.includes(parent)) continue;

        const label = await resolveLabel(segment, parent, tenantId);
        if (label) labels[segment] = label;
      }

      if (!cancelled && Object.keys(labels).length > 0) {
        setResolvedLabels((current) => ({ ...current, ...labels }));
      }
    }

    void fetchLabels();
    return () => {
      cancelled = true;
    };
  }, [pathSegments, resolvedLabels, tenantId]);

  return { tenantId, pathSegments, resolvedLabels };
}
