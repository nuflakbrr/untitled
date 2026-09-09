import type { Route } from 'next';
import type { AdminDashboardStats } from '@/interfaces/features/dashboard';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

const date = (value: Date) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
const registrationStatus: Record<string, string> = {
  CHECKED_IN: 'Hadir',
  REGISTERED: 'Terdaftar',
  WAITING_PAYMENT: 'Menunggu Pembayaran',
  CANCELLED: 'Dibatalkan',
};
const paymentStatus: Record<string, string> = {
  WAITING: 'Menunggu Verifikasi',
  PAID: 'Lunas',
  FAILED: 'Ditolak',
  REFUNDED: 'Dikembalikan',
};

export default function RecentRegistrations({
  registrations,
}: {
  registrations: AdminDashboardStats['recentRegistrations'];
}) {
  return (
    <Card className="border-none shadow-md ring-0">
      <CardHeader className="flex flex-row items-center justify-between border-b border-foreground/5 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Users className="h-5 w-5 text-primary" /> Registrasi Terbaru
          </CardTitle>
          <CardDescription>Pendaftaran event terbaru dari peserta</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={'/admin/transactions/registrations' as Route}>Lihat Semua</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {registrations.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            Belum ada registrasi peserta.
          </div>
        ) : (
          <div className="divide-y divide-foreground/5">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{reg.user.name || 'Anonymous'}</p>
                  <p className="truncate text-xs text-muted-foreground">{reg.user.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="max-w-30 truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      {reg.event.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{date(reg.createdAt)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <Badge
                    variant="outline"
                    className={`px-1.5 py-0 text-[10px] font-semibold ${
                      reg.status === 'CHECKED_IN'
                        ? 'border-blue-200 bg-blue-500/10 text-blue-600'
                        : reg.status === 'REGISTERED'
                          ? 'border-emerald-200 bg-emerald-500/10 text-emerald-600'
                          : reg.status === 'WAITING_PAYMENT'
                            ? 'border-amber-200 bg-amber-500/10 text-amber-600'
                            : 'border-rose-200 bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {registrationStatus[reg.status] ?? reg.status}
                  </Badge>
                  {reg.event.price > 0 && reg.payment && (
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      Pembayaran: {paymentStatus[reg.payment.status] ?? reg.payment.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
