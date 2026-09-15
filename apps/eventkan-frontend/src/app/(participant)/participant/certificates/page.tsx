'use client';

import { Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import type { CertificateResponse } from '@/interfaces/features/certificates';

import { DataTable } from '@/components/ui/data-table';
import EmptyState from '@/components/Common/EmptyState';
import { getParticipantCertificates } from '@/services/admin/certificates';

import Columns from './_components/Columns';

export default function ParticipantCertificatesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['participant-certificates'],
    queryFn: getParticipantCertificates,
  });

  const certificates = (Array.isArray(data) ? data : []) as CertificateResponse[];

  return (
    <section className="space-y-7 pb-10">
      <header className="flex flex-col gap-6 border-b border-[#111927]/10 pb-8">
        <div>
          <h1 className="font-display mt-2 text-[clamp(38px,5vw,58px)] font-extrabold leading-none tracking-tighter text-[#111927]">
            Sertifikat <span className="text-[#ff7a45]">({certificates.length})</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6c7280]">
            Cek dan download sertifikat dari event yang sudah kamu ikuti.
          </p>
        </div>
      </header>

      {certificates.length === 0 && !isLoading ? (
        <EmptyState
          icon={Award}
          title="Belum ada sertifikat."
          description="Sertifikat akan muncul di sini setelah event selesai dan kehadiranmu diverifikasi."
          action={{ href: '/participant/event-history', label: 'Lihat Riwayat Event' }}
        />
      ) : (
        <div className="rounded-[24px] border border-[#111927]/10 bg-[#fffdf8] p-2 shadow-[0_18px_50px_rgba(17,35,63,.05)] sm:p-3">
          <DataTable
            searchKey={['event.title', 'certificateNumber']}
            columns={Columns}
            data={certificates}
            enableRowSelection={false}
            isFetching={isLoading}
            pageCount={1}
            placeholderSearch="Cari event atau nomor sertifikat..."
          />
        </div>
      )}
    </section>
  );
}
