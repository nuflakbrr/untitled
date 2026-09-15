import type { Route } from 'next';
import type { AdminDashboardStats } from '@/interfaces/features/dashboard';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, CreditCard, CheckSquare, ChevronRight } from 'lucide-react';

const money = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export default function DashboardStats({ counts }: { counts: AdminDashboardStats['counts'] }) {
  const stats = [
    [
      'Total Event',
      counts.events.total,
      `${counts.events.published} Aktif | ${counts.events.draft} Draft`,
      Calendar,
      '/admin/master/events',
      'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-100 dark:border-emerald-950',
    ],
    [
      'Total Registrasi',
      counts.registrations.total,
      `Peserta Terdaftar`,
      Users,
      '/admin/transactions/registrations',
      'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 border-blue-100 dark:border-blue-950',
    ],
    [
      'Pendapatan',
      money(counts.revenue),
      'Dari pembayaran sukses',
      CreditCard,
      '/admin/transactions/payments',
      'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 border-rose-100 dark:border-rose-950',
    ],
    [
      'Kehadiran (Check-In)',
      counts.checkIns,
      `${counts.certificates} Sertifikat Terbit`,
      CheckSquare,
      '/admin/attendances',
      'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 border-amber-100 dark:border-amber-950',
    ],
  ] as const;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {stats.map(([title, value, description, Icon, href, colorClass]) => (
        <Card
          key={title}
          className="group border-none shadow-md ring-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </p>
              <h3 className="text-2xl font-extrabold tracking-tight">{value}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div
              className={`rounded-xl border p-3 transition-transform duration-300 group-hover:-rotate-6 ${colorClass}`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </CardContent>
          <div className="flex justify-end px-6 pb-4 pt-2">
            <Link
              href={href as Route}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary"
            >
              Kelola <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
