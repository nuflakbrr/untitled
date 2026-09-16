'use client';

import { CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import type { ParticipantPayment } from '@/interfaces/features/payments';

import { DataTable } from '@/components/ui/data-table';
import EmptyState from '@/components/Common/EmptyState';
import { getParticipantPayments } from '@/services/admin/payments';

import Columns from './_components/Columns';

export default function PaymentHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['participant-payments'],
    queryFn: getParticipantPayments,
  });

  const payments = (Array.isArray(data) ? data : []) as ParticipantPayment[];

  return (
    <section className="space-y-7 pb-10">
      <header className="flex flex-col gap-6 border-b border-eventkan-ink/10 pb-8">
        <div>
          <h1 className="font-display mt-2 text-[clamp(38px,5vw,58px)] font-extrabold leading-none tracking-tighter text-eventkan-ink">
            Riwayat Pembayaran <span className="text-eventkan-accent">({payments.length})</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-eventkan-muted">
            Cek semua pembayaran event kamu, dari yang masih diproses sampai yang sudah beres.
          </p>
        </div>
      </header>

      {payments.length === 0 && !isLoading ? (
        <EmptyState
          icon={CreditCard}
          title="Belum ada pembayaran"
          description="Belum ada transaksi pembayaran event yang tercatat di akunmu."
          action={{ href: '/events', label: 'Jelajahi event' }}
        />
      ) : (
        <div className="rounded-[24px] border border-eventkan-ink/10 bg-eventkan-surface p-2 shadow-[0_18px_50px_rgba(17,35,63,.05)] sm:p-3">
          <DataTable
            searchKey={['registration.registrationNumber', 'registration.event.title']}
            columns={Columns}
            data={payments}
            enableRowSelection={false}
            isFetching={isLoading}
            pageCount={1}
            placeholderSearch="Cari no. registrasi atau event..."
          />
        </div>
      )}
    </section>
  );
}
