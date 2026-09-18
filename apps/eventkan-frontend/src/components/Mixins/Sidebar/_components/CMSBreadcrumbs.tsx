import { useMemo } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { useBreadcrumbs } from '../_hooks/useBreadcrumbs';
import {
  formatBreadcrumbSegment,
  nonClickableBreadcrumbs,
} from '../_constants/breadcrumbs.constants';

export function CMSBreadcrumbs() {
  const { tenantId, pathSegments, resolvedLabels } = useBreadcrumbs();
  const labels = useMemo(
    () => pathSegments.map((segment) => formatBreadcrumbSegment(segment, resolvedLabels)),
    [pathSegments, resolvedLabels]
  );
  const homeHref = tenantId ? `/admin/${tenantId}/dashboard` : '/admin/dashboard';

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.length > 0 && (
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href={homeHref}>EVENTKAN</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = tenantId
            ? `/admin/${tenantId}/${pathSegments.slice(index + 1).join('/')}`
            : `/${pathSegments.slice(0, index + 1).join('/')}`;

          return (
            <div key={href} className="flex items-center gap-2">
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast || nonClickableBreadcrumbs.has(segment) ? (
                  <BreadcrumbPage>{labels[index]}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="hidden md:block">
                    {labels[index]}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
