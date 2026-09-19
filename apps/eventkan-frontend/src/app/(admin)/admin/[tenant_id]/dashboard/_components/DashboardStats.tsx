import type { Route } from 'next';

import Link from 'next/link';
import { Users, Award, Calendar, CreditCard, ChevronRight } from 'lucide-react';

import type { AdminDashboardStats } from '@/interfaces/features/dashboard';

import { Card, CardContent } from '@/components/ui/card';

const money = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export default function DashboardStats({
  counts,
  tenantId,
}: {
  counts: AdminDashboardStats['counts'];
  tenantId: string;
}) {
  const stats = [
    [
      'Total Event',
      counts.events.total,
      `${counts.events.published} Aktif | ${counts.events.draft} Draft`,
      Calendar,
      `/admin/${tenantId}/master/events`,
      'bg-eventkan-peach text-eventkan-accent',
    ],
    [
      'Total Registrasi',
      counts.registrations.total,
      `Peserta Terdaftar`,
      Users,
      `/admin/${tenantId}/transactions/registrations`,
      'bg-eventkan-navy/8 text-eventkan-navy',
    ],
    [
      'Pendapatan',
      money(counts.revenue),
      'Dari pembayaran sukses',
      CreditCard,
      `/admin/${tenantId}/transactions/payments`,
      'bg-eventkan-green text-eventkan-green-ink',
    ],
    [
      'Kehadiran (Check-In)',
      counts.checkIns,
      `${counts.certificates} Sertifikat Terbit`,
      Award,
      `/admin/${tenantId}/attendance/scan`,
      'bg-eventkan-yellow text-[#856b16]',
    ],
  ] as const;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {stats.map(([title, value, description, Icon, href, colorClass]) => (
        <Card
          key={title}
          className="group border min-h-37.5 rounded-[20px] bg-eventkan-surface py-0 shadow-[0_18px_50px_rgba(17,35,63,.05)] ring-0 transition-shadow hover:shadow-[0_22px_60px_rgba(17,35,63,.09)]"
        >
          <CardContent className="flex items-start justify-between p-5">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted">
                {title}
              </p>
              <h3 className="font-display mt-2 text-[32px] font-extrabold leading-none tracking-[-.04em] text-eventkan-ink">
                {value}
              </h3>
              <p className="mt-2 text-[11px] text-eventkan-muted">{description}</p>
              <Link
                href={href as Route}
                className="mt-4 inline-flex cursor-pointer items-center gap-1 text-[11px] font-extrabold text-eventkan-navy transition hover:text-eventkan-accent"
              >
                Kelola <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div
              className={`grid h-11.5 w-11.5 place-items-center rounded-[14px] transition-transform duration-300 group-hover:-rotate-6 ${colorClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
