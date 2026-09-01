'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

import { downloadExcel } from '../excel-export';

type Row = {
  id: string;
  registration_number: string;
  user_name: string;
  user_email: string;
  event_title: string;
  status: string;
  event_status: string;
  created_at: string;
};

const statusLabel: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Dipublikasikan',
  CLOSED: 'Ditutup',
  COMPLETED: 'Selesai',
  WAITING_PAYMENT: 'Menunggu pembayaran',
  REGISTERED: 'Terdaftar',
  CHECKED_IN: 'Hadir',
  CANCELLED: 'Dibatalkan',
};

function StatusBadge({ value }: { value: string }) {
  const color =
    value === 'COMPLETED' || value === 'REGISTERED' || value === 'CHECKED_IN'
      ? 'success'
      : value === 'CANCELLED'
        ? 'error'
        : value === 'PUBLISHED'
          ? 'info'
          : value === 'WAITING_PAYMENT' || value === 'CLOSED'
            ? 'warning'
            : 'default';

  return <Chip size="small" color={color} label={statusLabel[value] ?? value} />;
}

export function RegistrationTable({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [event, setEvent] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const t = setTimeout(() => setQuery(q), 300);
    return () => clearTimeout(t);
  }, [q]);
  const events = useMemo(() => Array.from(new Set(rows.map((r) => r.event_title))), [rows]);
  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (event === 'ALL' || r.event_title === event) &&
          (status === 'ALL' || r.event_status === status) &&
          `${r.user_name} ${r.user_email} ${r.registration_number} ${r.event_title}`
            .toLowerCase()
            .includes(query.toLowerCase())
      ),
    [rows, event, status, query]
  );
  const pageRows = filtered.slice((page - 1) * 10, page * 10);
  const exportExcel = async () => {
    const header = [
      'Peserta',
      'Email',
      'Event',
      'Status event',
      'Status pendaftaran',
      'Nomor registrasi',
      'Tanggal',
    ];
    await downloadExcel(
      'pendaftaran.xlsx',
      'Pendaftaran',
      header,
      filtered.map((r) => [
        r.user_name,
        r.user_email,
        r.event_title,
        statusLabel[r.event_status] ?? r.event_status,
        statusLabel[r.status] ?? r.status,
        r.registration_number,
        new Date(r.created_at).toLocaleDateString('id-ID'),
      ]),
      'FF1565C0',
      `Filter: ${event === 'ALL' ? 'Semua event' : event} · ${status === 'ALL' ? 'Semua status event' : (statusLabel[status] ?? status)} · ${query || 'Tanpa pencarian'} · Total ${filtered.length} data`
    );
  };
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Cari pendaftaran"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <TextField
          select
          size="small"
          label="Event"
          value={event}
          onChange={(e) => {
            setEvent(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="ALL">Semua event</MenuItem>
          {events.map((v) => (
            <MenuItem key={v} value={v}>
              {v}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="ALL">Semua status</MenuItem>
          <MenuItem value="DRAFT">Draft</MenuItem>
          <MenuItem value="PUBLISHED">Dipublikasikan</MenuItem>
          <MenuItem value="CLOSED">Ditutup</MenuItem>
          <MenuItem value="COMPLETED">Selesai</MenuItem>
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
              <TableCell>Email</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Nomor registrasi</TableCell>
              <TableCell>Status pendaftaran</TableCell>
              <TableCell>Status event</TableCell>
              <TableCell>Tanggal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.user_name}</TableCell>
                  <TableCell>{r.user_email}</TableCell>
                  <TableCell>{r.event_title}</TableCell>
                  <TableCell>{r.registration_number}</TableCell>
                  <TableCell>
                    <StatusBadge value={r.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={r.event_status} />
                  </TableCell>
                  <TableCell>{new Date(r.created_at).toLocaleDateString('id-ID')}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {query || event !== 'ALL' || status !== 'ALL'
                      ? 'Pendaftaran tidak ditemukan.'
                      : 'Belum ada pendaftaran.'}
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
          onChange={(_, v) => setPage(v)}
        />
      ) : null}
    </Box>
  );
}
