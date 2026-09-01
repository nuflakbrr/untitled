'use client';

import { useMemo, useState, useEffect, useActionState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import { deleteEventAction } from 'src/auth/actions';

type Event = {
  id: string;
  title: string;
  category?: { name: string } | null;
  start_date: string;
  location: string;
  event_type: string;
  status: string;
};
export function EventTable({ rows }: { rows: Event[] }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [eventType, setEventType] = useState('ALL');
  const [state, action, pending] = useActionState(deleteEventAction, { error: '', success: '' });
  const [sort, setSort] = useState<{ key: keyof Event; direction: 'asc' | 'desc' }>({
    key: 'start_date',
    direction: 'asc',
  });
  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);
  const toggle = (key: keyof Event) =>
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  const data = useMemo(
    () =>
      rows
        .filter(
          (event) =>
            (status === 'ALL' || event.status === status) &&
            (eventType === 'ALL' || event.event_type === eventType) &&
            `${event.title} ${event.location} ${event.event_type}`
              .toLowerCase()
              .includes(query.toLowerCase())
        )
        .sort(
          (a, b) =>
            String(a[sort.key]).localeCompare(String(b[sort.key])) *
            (sort.direction === 'asc' ? 1 : -1)
        ),
    [rows, query, status, eventType, sort]
  );
  const heading = (label: string, key: keyof Event) => (
    <Button onClick={() => toggle(key)} sx={{ fontWeight: 700, color: 'inherit', px: 0 }}>
      {label} {sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
    </Button>
  );
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {state.error ? <Typography color="error">{state.error}</Typography> : null}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Cari event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="ALL">Semua status</MenuItem>
          <MenuItem value="DRAFT">Draft</MenuItem>
          <MenuItem value="PUBLISHED">Dipublikasikan</MenuItem>
          <MenuItem value="CLOSED">Ditutup</MenuItem>
          <MenuItem value="COMPLETED">Selesai</MenuItem>
        </Select>
        <Select size="small" value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <MenuItem value="ALL">Semua tipe</MenuItem>
          <MenuItem value="ONLINE">Online</MenuItem>
          <MenuItem value="OFFLINE">Offline</MenuItem>
        </Select>
      </Box>
      <TableContainer sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>{heading('Event', 'title')}</TableCell>
              <TableCell>{heading('Tanggal', 'start_date')}</TableCell>
              <TableCell>{heading('Lokasi', 'location')}</TableCell>
              <TableCell>{heading('Tipe', 'event_type')}</TableCell>
              <TableCell>{heading('Status', 'status')}</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>{event.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.category?.name || 'Tanpa kategori'}
                  </Typography>
                </TableCell>
                <TableCell>{event.start_date.slice(0, 10)}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={event.event_type === 'ONLINE' ? 'Online' : 'Offline'}
                    color={event.event_type === 'ONLINE' ? 'info' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={
                      event.status === 'PUBLISHED'
                        ? 'Dipublikasikan'
                        : event.status === 'DRAFT'
                          ? 'Draft'
                          : event.status === 'COMPLETED'
                            ? 'Selesai'
                            : 'Ditutup'
                    }
                    color={
                      event.status === 'PUBLISHED'
                        ? 'success'
                        : event.status === 'COMPLETED'
                          ? 'info'
                          : event.status === 'CLOSED'
                            ? 'warning'
                            : 'default'
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
                  <Tooltip title="Edit event">
                    <IconButton
                      component={RouterLink}
                      href={`${paths.dashboard.events}/${event.id}/edit`}
                      aria-label="Edit event"
                      size="small"
                    >
                      <Iconify icon="solar:pen-new-square-linear" />
                    </IconButton>
                  </Tooltip>
                  <Box component="form" action={action}>
                    <input type="hidden" name="id" value={event.id} />
                    <Tooltip title="Hapus event">
                      <span>
                        <ConfirmSubmitButton
                          title="Hapus event?"
                          description="Event yang dihapus tidak dapat dipulihkan."
                          color="error"
                          variant="text"
                            disabled={pending}
                            aria-label="Hapus event"
                            iconOnly
                            size="small"
                        >
                          <Iconify icon="solar:trash-bin-trash-linear" />
                        </ConfirmSubmitButton>
                      </span>
                    </Tooltip>
                  </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
