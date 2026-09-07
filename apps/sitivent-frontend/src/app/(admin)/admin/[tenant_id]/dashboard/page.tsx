import type { Route } from 'next';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GreetingCard from '@/components/Common/GreetingCard';
import { getAdminDashboardData } from '@/services/admin/dashboard';
import { Users, Calendar, CreditCard, CheckSquare, ChevronRight } from 'lucide-react';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import EventLeaderboard from './_components/EventLeaderboard';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

const getRegistrationStatusLabel = (status: string) => {
  switch (status) {
    case 'CHECKED_IN':
      return 'Hadir';
    case 'REGISTERED':
      return 'Terdaftar';
    case 'WAITING_PAYMENT':
      return 'Menunggu Pembayaran';
    case 'CANCELLED':
      return 'Dibatalkan';
    default:
      return status;
  }
};

const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'WAITING':
      return 'Menunggu Verifikasi';
    case 'PAID':
      return 'Lunas';
    case 'FAILED':
      return 'Ditolak';
    case 'REFUNDED':
      return 'Dikembalikan';
    default:
      return status;
  }
};

export const dynamic = 'force-dynamic';

const DashboardCMS = async ({ params }: { params: Promise<{ tenant_id: string }> }) => {
  const { tenant_id: tenantId } = await params;
  const data = await getAdminDashboardData(tenantId);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-muted-foreground">Gagal memuat data dashboard.</p>
      </div>
    );
  }

  const { counts, popularEvents, recentRegistrations } = data;

  const statsConfig = [
    {
      title: 'Total Event',
      value: counts.events.total,
      description: `${counts.events.published} Aktif | ${counts.events.draft} Draft`,
      icon: Calendar,
      href: '/admin/master/events',
      colorClass:
        'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-100 dark:border-emerald-950',
    },
    {
      title: 'Total Registrasi',
      value: counts.registrations.total,
      description: `${counts.registrations.uniqueParticipants} Peserta Unik`,
      icon: Users,
      href: '/admin/transactions/registrations',
      colorClass:
        'text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/20 border-blue-100 dark:border-blue-950',
    },
    {
      title: 'Pendapatan',
      value: formatCurrency(counts.revenue),
      description: 'Dari pembayaran sukses',
      icon: CreditCard,
      href: '/admin/transactions/payments',
      colorClass:
        'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 border-rose-100 dark:border-rose-950',
    },
    {
      title: 'Kehadiran (Check-In)',
      value: counts.checkIns,
      description: `${counts.certificates} Sertifikat Terbit`,
      icon: CheckSquare,
      href: '/admin/attendances',
      colorClass:
        'text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/20 border-amber-100 dark:border-amber-950',
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Welcoming Section */}
      <GreetingCard />

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsConfig.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="hover:scale-[1.02] hover:shadow-lg transition-all duration-300 shadow-md border-none ring-0 group"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div
                  className={`p-3 rounded-xl border ${stat.colorClass} transition-transform duration-300 group-hover:-rotate-6`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </CardContent>
              <div className="px-6 pb-4 pt-2 flex justify-end">
                <Link
                  href={stat.href as Route}
                  className="text-xs text-muted-foreground group-hover:text-primary flex items-center gap-1 transition-colors font-medium"
                >
                  Kelola{' '}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Side: Recent Registrations (col-span-2) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="flex flex-row items-center justify-between border-b border-foreground/5 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Registrasi Terbaru
                </CardTitle>
                <CardDescription>Pendaftaran event terbaru dari peserta</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={'/admin/transactions/registrations' as Route}>Lihat Semua</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {recentRegistrations.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Belum ada registrasi peserta.
                </div>
              ) : (
                <div className="divide-y divide-foreground/5">
                  {recentRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="py-4 first:pt-0 last:pb-0 flex justify-between items-center group"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">
                          {reg.user.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{reg.user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium truncate max-w-30">
                            {reg.event.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(reg.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 font-semibold ${
                            reg.status === 'CHECKED_IN'
                              ? 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30'
                              : reg.status === 'REGISTERED'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30'
                                : reg.status === 'WAITING_PAYMENT'
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30'
                                  : 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30'
                          }`}
                        >
                          {getRegistrationStatusLabel(reg.status)}
                        </Badge>
                        {reg.event.price > 0 && reg.payment && (
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            Pembayaran: {getPaymentStatusLabel(reg.payment.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Popular Events & System Shortcuts */}
        <div className="space-y-4 md:space-y-6">
          <EventLeaderboard
            title="Top 10 Event Terpopuler"
            subtitle="Event dengan jumlah pendaftar terbanyak."
            events={data.globalPopularEvents}
          />
          <EventLeaderboard
            title={`Top 10 Event ${data.tenantName || 'tenant aktif'}`}
            subtitle={`Event dengan pendaftar terbanyak di ${data.tenantName || 'tenant aktif'}.`}
            events={popularEvents}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardCMS;
