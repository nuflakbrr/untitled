'use client';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { RefreshButton } from 'src/components/refresh-button';

type CertificateEvent = {
  id: string;
  title: string;
  start_date: string;
  status: string;
  certificate_enabled: boolean;
};

const eventStatus: Record<string, string> = {
  DRAFT: 'Draft',
  PUBLISHED: 'Dipublikasikan',
  CLOSED: 'Ditutup',
  COMPLETED: 'Selesai',
};

export function CertificateTable({ rows }: { rows: CertificateEvent[] }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);
  const filtered = useMemo(
    () => rows.filter((event) => event.title.toLowerCase().includes(query.toLowerCase())),
    [query, rows]
  );
  const visible = filtered.slice((page - 1) * 10, page * 10);

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Cari event"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <RefreshButton />
      </Box>
      <TableContainer sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Event</TableCell>
              <TableCell>Tanggal</TableCell>
              <TableCell>Status event</TableCell>
              <TableCell>Sertifikat</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visible.length ? (
              visible.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{event.title}</Typography>
                  </TableCell>
                  <TableCell>{new Date(event.start_date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <Chip size="small" label={eventStatus[event.status] ?? event.status} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={event.certificate_enabled ? 'success' : 'default'}
                      label={event.certificate_enabled ? 'Aktif' : 'Tidak aktif'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component="a"
                      href={paths.dashboard.certificateEditor(event.id)}
                      size="small"
                      variant="outlined"
                      disabled={!event.certificate_enabled}
                    >
                      Buka editor
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {query ? 'Event tidak ditemukan.' : 'Belum ada event.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {filtered.length > 10 ? (
        <Pagination
          page={page}
          count={Math.ceil(filtered.length / 10)}
          onChange={(_, value) => setPage(value)}
        />
      ) : null}
    </Box>
  );
}
