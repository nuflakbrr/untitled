'use client';

import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import {
  getRegistrations,
  getEventsForFilter,
  exportRegistrationsData,
} from '@/services/admin/registrations';

export const useRegistrationsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['registrations', page, limit, debouncedSearch, eventId, statusFilter],
    queryFn: () => getRegistrations(page, limit, debouncedSearch, eventId, statusFilter),
  });

  const { data: eventsData } = useQuery({
    queryKey: ['events-for-filter'],
    queryFn: () => getEventsForFilter(),
  });

  const registrations = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };
  const events = eventsData?.data || [];

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
    setPage(1);
  };

  const handleEventChange = (id: string | undefined) => {
    setEventId(id);
    setPage(1);
  };

  const handleStatusChange = (status: string | undefined) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await exportRegistrationsData(search, eventId, statusFilter);
      if (!res.success || !res.data) {
        toast.error(res.error || 'Gagal mengeksport data.');
        return;
      }

      if (res.data.length === 0) {
        toast.error('Tidak ada data registrasi untuk dieksport.');
        return;
      }

      const statusLabels: Record<string, string> = {
        WAITING_PAYMENT: 'Menunggu Pembayaran',
        REGISTERED: 'Terdaftar',
        CANCELLED: 'Dibatalkan',
        CHECKED_IN: 'Hadir',
      };

      const selectedEventTitle =
        events.find((e: { id: string; title: string }) => e.id === eventId)?.title || 'Semua Event';
      const selectedStatusLabel = statusLabels[statusFilter || ''] || 'Semua Status';
      const exportDate = moment().tz('Asia/Jakarta').locale('id').format('DD MMMM YYYY, HH:mm');

      const headerData = [
        ['LAPORAN REKAPITULASI PENDAFTARAN EVENT - SITIVENT'],
        [],
        ['Filter Event:', selectedEventTitle],
        ['Filter Status:', selectedStatusLabel],
        ['Tanggal Export:', exportDate],
        ['Total Data:', `${res.data.length} Peserta`],
        [],
        [
          'No.',
          'No. Registrasi',
          'Nama Peserta',
          'Email',
          'Nama Event',
          'Tipe Event',
          'Harga Tiket',
          'Status Pendaftaran',
          'Tanggal Pendaftaran',
        ],
      ];

      const tableRows = res.data.map((item: any, index: number) => {
        const num = index + 1;
        const regNo = item.registrationNumber;
        const name = item.user?.name || '-';
        const email = item.user?.email || '-';
        const eventTitle = item.event?.title || '-';
        const eventType = (item.event?.price || 0) > 0 ? 'Berbayar' : 'Gratis';
        const price = item.event?.price ? `Rp ${item.event.price.toLocaleString('id-ID')}` : 'Rp 0';
        const status = statusLabels[item.status] || item.status;
        const date = moment(item.createdAt)
          .tz('Asia/Jakarta')
          .locale('id')
          .format('DD MMMM YYYY, HH:mm');

        return [num, regNo, name, email, eventTitle, eventType, price, status, date];
      });

      const worksheet = XLSX.utils.aoa_to_sheet([...headerData, ...tableRows]);

      // Atur lebar kolom
      worksheet['!cols'] = [
        { wch: 6 }, // No.
        { wch: 22 }, // No. Registrasi
        { wch: 26 }, // Nama Peserta
        { wch: 30 }, // Email
        { wch: 35 }, // Nama Event
        { wch: 15 }, // Tipe Event
        { wch: 18 }, // Harga Tiket
        { wch: 24 }, // Status Pendaftaran
        { wch: 24 }, // Tanggal Pendaftaran
      ];

      // Merge judul
      worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Pendaftaran');

      const sanitizedTitle = selectedEventTitle
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const dateStr = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
      const fileName = `laporan-pendaftaran-${sanitizedTitle || 'semua'}-${dateStr}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      toast.success(`Berhasil meng-export ${res.data.length} data pendaftaran!`);
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat meng-export data.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    page,
    setPage,
    search,
    limit,
    setLimit,
    eventId,
    setEventId: handleEventChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    events,
    registrations,
    meta,
    isLoading,
    handleSearchChange,
    isExporting,
    handleExportExcel,
  };
};
