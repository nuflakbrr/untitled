'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { Route } from 'next';

import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';
import { Users } from 'lucide-react';

import type { AdminDashboardStats } from '@/interfaces/features/dashboard';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/getInitials';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';
import {
  formatPaymentStatusLabel,
  formatRegistrationStatusLabel,
} from '@/lib/formatAdminBadgeLabel';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table';

import { registrationStatusClass } from '../_constants/recentRegistrations.constants';

const date = (value: Date) => moment(value).tz('Asia/Jakarta').locale('id').format('D MMM YYYY');
export default function RecentRegistrations({
  registrations,
  tenantId,
}: {
  registrations: AdminDashboardStats['recentRegistrations'];
  tenantId: string;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageCount = Math.max(1, Math.ceil(registrations.length / pageSize));
  const paginatedRegistrations = registrations.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card className="overflow-hidden border rounded-[22px] bg-eventkan-surface py-0 pb-0 shadow-[0_18px_50px_rgba(17,35,63,.06)] ring-0">
      <CardHeader className="flex flex-row items-center justify-between px-5 pb-0 pt-5">
        <div>
          <CardTitle className="flex items-center gap-2 font-display text-lg font-extrabold text-eventkan-ink">
            <Users className="h-5 w-5 text-eventkan-accent" /> Registrasi Terbaru
          </CardTitle>
          <CardDescription className="mt-1 text-[11px] text-eventkan-muted">
            Pendaftaran event terbaru dari peserta
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer! font-bold text-eventkan-navy hover:bg-eventkan-peach hover:text-eventkan-peach-ink"
          asChild
        >
          <Link href={`/admin/${tenantId}/transactions/registrations` as Route}>Lihat Semua</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {registrations.length === 0 ? (
          <div className="py-10 text-center text-sm text-eventkan-muted">
            Belum ada registrasi peserta.
          </div>
        ) : (
          <div className="px-4 pb-4 sm:px-5">
            <Table className="min-w-170 border-separate border-spacing-y-2">
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="h-7 px-3 text-[10px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted">
                    Peserta
                  </TableHead>
                  <TableHead className="h-7 px-3 text-[10px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted">
                    Event
                  </TableHead>
                  <TableHead className="h-7 px-3 text-right text-[10px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRegistrations.map((reg) => (
                  <TableRow
                    key={reg.id}
                    className="border-0 bg-eventkan-canvas/45 hover:bg-eventkan-canvas [&>td:first-child]:rounded-l-[16px] [&>td:last-child]:rounded-r-[16px]"
                  >
                    <TableCell className="px-3 py-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-eventkan-navy/8 text-[10px] font-extrabold text-eventkan-navy">
                          {getInitials(reg.user.name || 'Anonymous')}
                        </span>
                        <span className="min-w-0">
                          <strong className="block truncate text-[11px] font-extrabold text-eventkan-ink">
                            {reg.user.name || 'Anonymous'}
                          </strong>
                          <span className="block truncate text-[10px] text-eventkan-muted">
                            {reg.user.email}
                          </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <p className="truncate text-[11px] font-semibold text-eventkan-ink">
                        {reg.event.title}
                      </p>
                      <p className="mt-1 text-[10px] text-eventkan-muted">{date(reg.createdAt)}</p>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-right">
                      <Badge
                        variant="secondary"
                        className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${registrationStatusClass[reg.status] ?? 'bg-eventkan-canvas text-eventkan-muted'}`}
                      >
                        {formatRegistrationStatusLabel(reg.status)}
                      </Badge>
                      {reg.event.price > 0 && reg.payment && (
                        <span className="mt-1 block text-[10px] font-semibold text-eventkan-muted">
                      {formatPaymentStatusLabel(reg.payment.status)}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {registrations.length > pageSize && (
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 pb-5 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-eventkan-ink">
              <span>Tampilkan</span>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-17.5 bg-eventkan-surface text-eventkan-ink">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 15, 20, 25, 30].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>baris data</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-eventkan-muted">
                Halaman {page} dari {pageCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                className={page === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              >
                Sebelumnya
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => setPage((value) => value + 1)}
                className={page >= pageCount ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
