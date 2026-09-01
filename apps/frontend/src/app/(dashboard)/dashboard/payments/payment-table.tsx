'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

import { downloadExcel } from '../excel-export';

type Payment = {
  id: string;
  user_name: string;
  user_email: string;
  event_title: string;
  registration_number: string;
  payment_status: string;
  amount: number;
  provider: string;
  transaction_id: string;
  created_at: string;
};

const labels: Record<string, string> = {
  WAITING: 'Menunggu pembayaran',
  PAID: 'Berhasil dibayar',
  FAILED: 'Gagal',
  EXPIRED: 'Kedaluwarsa',
};

function PaymentStatus({ value }: { value: string }) {
  return (
    <Chip
      size="small"
      label={labels[value] ?? value}
      color={value === 'PAID' ? 'success' : value === 'WAITING' ? 'warning' : 'error'}
    />
  );
}

export function PaymentTable({ rows }: { rows: Payment[] }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);
  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (status === 'ALL' || row.payment_status === status) &&
          `${row.user_name} ${row.user_email} ${row.event_title} ${row.registration_number}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [rows, query, status]
  );
  const exportExcel = async () => {
    const header = [
      'Peserta',
      'Email',
      'Event',
      'Nomor registrasi',
      'Status pembayaran',
      'Jumlah',
      'Provider',
      'ID transaksi',
      'Tanggal',
    ];
    await downloadExcel(
      'pembayaran.xlsx',
      'Pembayaran',
      header,
      filtered.map((row) => [
        row.user_name,
        row.user_email,
        row.event_title,
        row.registration_number,
        labels[row.payment_status] ?? row.payment_status,
        `Rp ${row.amount.toLocaleString('id-ID')}`,
        row.provider,
        row.transaction_id || '-',
        new Date(row.created_at).toLocaleDateString('id-ID'),
      ]),
      'FF2E7D32',
      `Filter: ${status === 'ALL' ? 'Semua status pembayaran' : (labels[status] ?? status)} · ${query || 'Tanpa pencarian'} · Total ${filtered.length} data`
    );
  };
  const items = filtered.slice((page - 1) * 10, page * 10);
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Cari pembayaran"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          sx={{ flex: 1, minWidth: 240 }}
        />
        <TextField
          select
          size="small"
          label="Status pembayaran"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 210 }}
        >
          <MenuItem value="ALL">Semua status</MenuItem>
          <MenuItem value="WAITING">Menunggu pembayaran</MenuItem>
          <MenuItem value="PAID">Berhasil dibayar</MenuItem>
          <MenuItem value="FAILED">Gagal</MenuItem>
          <MenuItem value="EXPIRED">Kedaluwarsa</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="success"
          startIcon={<Iconify icon="solar:file-download-bold" />}
          onClick={exportExcel}
          disabled={!filtered.length}
        >
          Export Excel
        </Button>
      </Box>
      <TableContainer sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Peserta</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Nomor registrasi</TableCell>
              <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>Jumlah</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tanggal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length ? (
              items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{row.user_name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.user_email}
                    </Typography>
                  </TableCell>
                  <TableCell>{row.event_title}</TableCell>
                  <TableCell>{row.registration_number}</TableCell>
                  <TableCell sx={{ width: 'auto', whiteSpace: 'nowrap' }}>
                    Rp {row.amount.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <PaymentStatus value={row.payment_status} />
                  </TableCell>
                  <TableCell>{new Date(row.created_at).toLocaleDateString('id-ID')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {query || status !== 'ALL'
                      ? 'Pembayaran tidak ditemukan.'
                      : 'Belum ada pembayaran.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {filtered.length > 10 ? (
        <Pagination
          count={Math.ceil(filtered.length / 10)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      ) : null}
    </Box>
  );
}
