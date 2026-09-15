'use client';

import { useState } from 'react';
import { Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import type { ParticipantRegistration } from '@/interfaces/features/registrations';

import { DataTable } from '@/components/ui/data-table';
import EmptyState from '@/app/(root)/_components/EmptyState';
import { getParticipantRegistrations } from '@/services/participant/registrations';

import Columns from './_components/Columns';
import TestimonialModal from './_components/TestimonialModal';
import EventHistoryStats from './_components/EventHistoryStats';

export default function EventHistoryPage() {
  const [selectedRegistration, setSelectedRegistration] = useState<ParticipantRegistration | null>(
    null
  );
  const { data, isLoading } = useQuery({
    queryKey: ['participant-registrations'],
    queryFn: getParticipantRegistrations,
  });

  const registrations = (Array.isArray(data) ? data : []) as ParticipantRegistration[];

  return (
    <section className="space-y-7 pb-10">
      <header className="flex flex-col gap-6 border-b border-[#111927]/10 pb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-[.08em] text-[#ff7a45]">
            Aktivitas Event
          </span>
          <h1 className="font-display mt-2 text-[clamp(38px,5vw,58px)] font-extrabold leading-none tracking-tighter text-[#111927]">
            Riwayat Event <span className="text-[#ff7a45]">({registrations.length})</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6c7280]">
            Lihat semua event yang pernah kamu daftarkan dan status kehadirannya.
          </p>
        </div>
      </header>

      <EventHistoryStats registrations={registrations} />

      {registrations.length === 0 && !isLoading ? (
        <EmptyState
          icon={Award}
          title="Belum ada riwayat event"
          description="Anda belum pernah mendaftar ke event apapun. Jelajahi event yang tersedia dan mulai perjalananmu."
          action={{ href: '/events', label: 'Jelajahi event' }}
        />
      ) : (
        <div className="rounded-[24px] border border-[#111927]/10 bg-[#fffdf8] p-2 shadow-[0_18px_50px_rgba(17,35,63,.05)] sm:p-3">
          <DataTable
            searchKey={['registrationNumber', 'event.title']}
            columns={Columns(setSelectedRegistration)}
            data={registrations}
            enableRowSelection={false}
            isFetching={isLoading}
            pageCount={1}
            placeholderSearch="Cari no. registrasi atau event..."
          />
        </div>
      )}

      {selectedRegistration && (
        <TestimonialModal
          isOpen
          onClose={() => setSelectedRegistration(null)}
          registrationId={selectedRegistration.id}
          eventTitle={selectedRegistration.event.title}
          existingTestimonial={selectedRegistration.testimonial}
        />
      )}
    </section>
  );
}
