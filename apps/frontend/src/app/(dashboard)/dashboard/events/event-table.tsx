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
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { RefreshButton } from 'src/components/refresh-button';
import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import {
  deleteEventAction,
  bulkDeleteEventsAction,
  permanentlyDeleteEventAction,
} from 'src/auth/actions';

type Event = {
  id: string;
  title: string;
  category?: { name: string } | null;
  start_date: string;
  location: string;
  event_type: string;
  status: string;
  price: number;
  deleted_at?: string | null;
};
export function EventTable({ rows }: { rows: Event[] }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [eventType, setEventType] = useState('ALL');
  const [dataStatus, setDataStatus] = useState('ACTIVE');
  const [page, setPage] = useState(1);
  const [state, action, pending] = useActionState(deleteEventAction, { error: '', success: '' });
  const [permanentState, permanentAction, permanentPending] = useActionState(
    permanentlyDeleteEventAction,
    { error: '', success: '' }
  );
  const [selected, setSelected] = useState<string[]>([]);
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
            (dataStatus === 'ALL' ||
              (dataStatus === 'DELETED' ? Boolean(event.deleted_at) : !event.deleted_at)) &&
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
    [rows, query, status, eventType, dataStatus, sort]
  );
  const heading = (label: string, key: keyof Event) => (
    <Button onClick={() => toggle(key)} sx={{ fontWeight: 700, color: 'inherit', px: 0 }}>
      {label} {sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
    </Button>
  );
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {state.error || permanentState.error ? (
        <Typography color="error">{state.error || permanentState.error}</Typography>
      ) : null}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Cari event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <Select
          size="small"
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
        </Select>
        <Select
          size="small"
          value={dataStatus}
          onChange={(e) => {
            setDataStatus(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="ACTIVE">Event aktif</MenuItem>
          <MenuItem value="DELETED">Event dihapus</MenuItem>
          <MenuItem value="ALL">Semua data</MenuItem>
        </Select>
        <Select
          size="small"
          value={eventType}
          onChange={(e) => {
            setEventType(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="ALL">Semua tipe</MenuItem>
          <MenuItem value="ONLINE">Online</MenuItem>
          <MenuItem value="OFFLINE">Offline</MenuItem>
        </Select>
        <RefreshButton />
      </Box>
      <TableContainer sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        {selected.length ? (
          <Box
            component="form"
            action={bulkDeleteEventsAction}
            sx={{ p: 1.5, display: 'flex', gap: 1, bgcolor: 'background.paper' }}
          >
            {selected.map((id) => (
              <input key={id} type="hidden" name="ids" value={id} />
            ))}
            <input
              type="hidden"
              name="permanent"
              value={String(
                selected.every((id) => data.find((event) => event.id === id)?.deleted_at)
              )}
            />
            <Button
              type="submit"
              color="error"
              variant="outlined"
              disabled={
                !selected.every(
                  (id) =>
                    Boolean(data.find((event) => event.id === id)?.deleted_at) ===
                    Boolean(data.find((event) => event.id === selected[0])?.deleted_at)
                )
              }
            >
              Hapus {selected.length} data
            </Button>
          </Box>
        ) : null}
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === data.length && data.length > 0}
                  onChange={(e) =>
                    setSelected(e.target.checked ? data.map((event) => event.id) : [])
                  }
                />
              </TableCell>
              <TableCell>{heading('Event', 'title')}</TableCell>
              <TableCell>{heading('Tanggal', 'start_date')}</TableCell>
              <TableCell>{heading('Lokasi', 'location')}</TableCell>
              <TableCell>{heading('Tipe', 'event_type')}</TableCell>
              <TableCell>{heading('Status', 'status')}</TableCell>
              <TableCell>Dihapus pada</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length ? (
              data.slice((page - 1) * 10, page * 10).map((event) => (
                <TableRow key={event.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(event.id)}
                      onChange={(e) =>
                        setSelected((current) =>
                          e.target.checked
                            ? [...current, event.id]
                            : current.filter((id) => id !== event.id)
                        )
                      }
                    />
                  </TableCell>
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
                        event.deleted_at
                          ? 'Dihapus'
                          : event.status === 'PUBLISHED'
                            ? 'Dipublikasikan'
                            : event.status === 'DRAFT'
                              ? 'Draft'
                              : event.status === 'COMPLETED'
                                ? 'Selesai'
                                : 'Ditutup'
                      }
                      color={
                        event.deleted_at
                          ? 'error'
                          : event.status === 'PUBLISHED'
                            ? 'success'
                            : event.status === 'COMPLETED'
                              ? 'info'
                              : event.status === 'CLOSED'
                                ? 'warning'
                                : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {event.deleted_at
                      ? new Date(event.deleted_at).toLocaleDateString('id-ID')
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      {!event.deleted_at ? (
                        <>
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
                                  description={
                                    event.price > 0
                                      ? 'Event akan disembunyikan dan peserta terdaftar akan dibatalkan. Pembayaran berbayar akan diproses untuk pengembalian dana.'
                                      : 'Event akan disembunyikan dan peserta terdaftar akan dibatalkan.'
                                  }
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
                        </>
                      ) : (
                        <Box component="form" action={permanentAction}>
                          <input type="hidden" name="id" value={event.id} />
                          <Tooltip title="Hapus permanen">
                            <span>
                              <ConfirmSubmitButton
                                title="Hapus event permanen?"
                                description="Semua data event, registrasi, dan pembayaran akan dihapus permanen dan tidak dapat dipulihkan."
                                color="error"
                                variant="text"
                                disabled={permanentPending}
                                aria-label="Hapus event permanen"
                                iconOnly
                                size="small"
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" />
                              </ConfirmSubmitButton>
                            </span>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {query || status !== 'ALL' || eventType !== 'ALL'
                      ? 'Event tidak ditemukan.'
                      : 'Belum ada event.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length > 10 ? (
        <Pagination
          count={Math.ceil(data.length / 10)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      ) : null}
    </Box>
  );
}
