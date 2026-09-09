'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { resolveLabel } from '@/services/admin/labels';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SearchForm } from '@/components/Mixins/Sidebar/SearchForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const labelMapping: Record<string, string> = {
  dashboard: 'Dashboard',
  master: 'Data Master',
  'event-categories': 'Kategori Event',
  events: 'Event',
  certificates: 'Sertifikat',
  transactions: 'Transaksi',
  registrations: 'Pendaftaran',
  payments: 'Pembayaran',
  attendance: 'Kehadiran',
  scan: 'Scan QR',
  managements: 'Manajemen',
  users: 'Pengguna',
  roles: 'Jabatan',
  permissions: 'Hak Akses',
  tenants: 'Organisasi',
  new: 'Tambah',
  publications: 'Publikasi',
  articles: 'Artikel',
  galleries: 'Galeri',
};

export function CMSHeader() {
  const pathname = usePathname();
  const rawSegments = pathname.split('/').filter((v) => v);
  const tenantId =
    rawSegments[0] === 'admin' && isUUID(rawSegments[1] ?? '') ? rawSegments[1] : null;
  const pathSegments = rawSegments.filter(
    (segment, index) => !(index === 1 && tenantId && segment === tenantId)
  );
  const [resolvedLabels, setResolvedLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLabels = async () => {
      const newLabels: Record<string, string> = {};
      let changed = false;

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const prevSegment = pathSegments[i - 1];

        // Skip static segments or already resolved ones
        if (labelMapping[segment] || resolvedLabels[segment]) continue;

        // Resolve dynamic segments based on parent
        const resolvableParents = [
          'event-categories',
          'events',
          'certificates',
          'transactions',
          'registrations',
          'payments',
          'attendance',
          'scan',
          'users',
          'roles',
          'permissions',
          'tenants',
          'articles',
          'galleries',
        ];
        if (prevSegment && resolvableParents.includes(prevSegment)) {
          const label = await resolveLabel(segment, prevSegment, tenantId);
          if (label) {
            newLabels[segment] = label;
            changed = true;
          }
        }
      }

      if (changed) {
        setResolvedLabels((prev) => ({ ...prev, ...newLabels }));
      }
    };

    fetchLabels();
  }, [pathSegments, pathname, resolvedLabels]); // Re-run when path changes

  const formatSegment = (segment: string) => {
    if (labelMapping[segment]) return labelMapping[segment];
    if (resolvedLabels[segment]) return resolvedLabels[segment];

    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className="z-10 sticky top-0 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.length > 0 && (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href={tenantId ? `/admin/${tenantId}/dashboard` : '/admin/dashboard'}
                >
                  SITIVENT
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {pathSegments.map((segment, index) => {
              if (segment === 'admin') return null;

              const href = tenantId
                ? `/admin/${tenantId}/${pathSegments.slice(index + 1).join('/')}`
                : `/${pathSegments.slice(0, index + 1).join('/')}`;
              const isLast = index === pathSegments.length - 1;
              const label = formatSegment(segment);

              const staticSegments = [
                'transactions',
                'registrations',
                'payments',
                'attendance',
                'scan',
              ];
              const isNonClickable = staticSegments.includes(segment);

              return (
                <div key={href} className="flex items-center gap-2">
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {isLast || isNonClickable ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="hidden md:block">
                        {label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <SearchForm />
    </header>
  );
}
