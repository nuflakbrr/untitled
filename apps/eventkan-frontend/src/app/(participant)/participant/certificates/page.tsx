'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import { Download, ChevronsUpDown } from 'lucide-react';
import { getParticipantCertificates } from '@/services/admin/certificates';

type Certificate = Awaited<ReturnType<typeof getParticipantCertificates>>[number];
const columns: ColumnDef<Certificate>[] = [
  { accessorKey: 'event.title', header: 'Event', cell: ({ row }) => <span className="text-sm font-medium">{row.original.event.title}</span> },
  { accessorKey: 'certificateNumber', header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>No. Sertifikat <ChevronsUpDown className="ml-2 h-4 w-4" /></Button> },
  { accessorKey: 'createdAt', header: 'Tanggal Terbit', cell: ({ row }) => <span className="text-sm">{new Date(row.original.createdAt).toLocaleDateString('id-ID')}</span> },
  { accessorKey: 'downloadUrl', header: 'Aksi', cell: ({ row }) => <Button asChild variant="outline" size="xs"><a href={row.original.downloadUrl} target="_blank" rel="noopener noreferrer"><Download className="mr-1 h-3.5 w-3.5" /> Unduh</a></Button> },
];

export default function ParticipantCertificatesPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ['participant-certificates'], queryFn: getParticipantCertificates });

  return (
    <section className="space-y-4">
      <Heading title={`Sertifikat (${data.length})`} description="Lihat dan unduh sertifikat event Anda." />
      <DataTable searchKey={['event.title', 'certificateNumber']} columns={columns} data={data} enableRowSelection={false} isFetching={isLoading} pageCount={1} placeholderSearch="Cari event atau nomor sertifikat..." />
    </section>
  );
}
