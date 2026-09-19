'use client';

import Link from 'next/link';
import { type FC, useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';

import type { EventWithCertificate } from '@/interfaces/features/certificates';

import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useTenantId } from '@/hooks/useTenantId';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

import Columns from './_components/Columns';
import { useCertificatesList } from './_hooks/useCertificatesList';

const CertificatesCMS: FC = () => {
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const {
    setPage,
    search,
    setLimit,
    certificates,
    meta,
    isLoading,
    handleSearchChange,
    eventsWithCert,
    eventId,
    handleEventChange,
    handleGenerate,
    isGenerating,
  } = useCertificatesList();

  return (
    <section className="mx-auto w-full max-w-375">
      <AlertModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          handleGenerate(eventId);
          setIsConfirmOpen(false);
        }}
        loading={isGenerating}
        title="Apakah Anda yakin?"
        desc={
          eventId
            ? 'Apakah Anda yakin ingin menyinkronkan sertifikat untuk event ini? Jika format template berubah, nomor sertifikat akan diperbarui dan status unduhan peserta akan di-reset.'
            : 'Apakah Anda yakin ingin menyinkronkan sertifikat untuk SEMUA event? Proses ini akan memproses semua data event yang aktif.'
        }
      />
      <Heading
        variant="soft"
        title="Manajemen Sertifikat"
        titleSuffix={`(${meta.total})`}
        description="Pantau dan kelola sertifikat elektronik untuk peserta event."
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {hasPermission('certificates.create') && (
            <Button
              onClick={() => setIsConfirmOpen(true)}
              disabled={isGenerating || isLoading}
              variant="outline"
              className="w-full rounded-xl border-eventkan-ink/10 text-eventkan-navy hover:bg-eventkan-canvas sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {eventId ? 'Sinkronisasi Event Ini' : 'Sinkronisasi Semua Event'}
            </Button>
          )}
          {hasPermission('certificates.create') && (
            <Button asChild className="w-full rounded-xl bg-eventkan-navy font-bold text-white hover:bg-eventkan-navy-hover sm:w-auto">
              <Link href={`/admin/${tenantId}/master/certificates/template`}>
                <Settings className="h-4 w-4 mr-2" /> Konfigurasi Template
              </Link>
            </Button>
          )}
          </div>
        }
      />
      <DataTable
        searchKey="certificateNumber"
        columns={Columns}
        data={certificates}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari No. Sertifikat, Event, atau Nama..."
        customFilters={
          <Select
            value={eventId || ''}
            onValueChange={(value) => handleEventChange(value || undefined)}
          >
            <SelectTrigger className="w-full sm:w-50">
              <SelectValue placeholder="Semua Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Event</SelectItem>
              {eventsWithCert.map((event: EventWithCertificate) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        variant="eventkan"
      />
    </section>
  );
};

export default CertificatesCMS;
