'use client';

import { useMemo, useState, useEffect, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { RefreshButton } from 'src/components/refresh-button';
import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import {
  deleteEventCategoryAction,
  bulkDeleteFeatureResourceAction,
  permanentDeleteEventCategoryAction,
} from 'src/auth/actions';

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  tenant_id?: string | null;
  deleted_at?: string | null;
};

export function EventCategoryTable({ rows }: { rows: Category[] }) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [deletedFilter, setDeletedFilter] = useState('ACTIVE');
  const [sort, setSort] = useState<{ key: keyof Category; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });
  const [state, action, pending] = useActionState(deleteEventCategoryAction, {
    error: '',
    success: '',
  });
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  const filtered = useMemo(() => {
    const result = rows.filter(
      (row) =>
        (deletedFilter === 'ALL' ||
          (deletedFilter === 'DELETED' ? row.deleted_at : !row.deleted_at)) &&
        `${row.name} ${row.slug} ${row.description ?? ''}`
          .toLowerCase()
          .includes(debounced.toLowerCase())
    );
    return result.sort(
      (a, b) =>
        String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? '')) *
        (sort.direction === 'asc' ? 1 : -1)
    );
  }, [rows, debounced, sort, deletedFilter]);
  const heading = (label: string, key: keyof Category) => (
    <Button
      onClick={() =>
        setSort((current) => ({
          key,
          direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }))
      }
      sx={{ fontWeight: 700, color: 'inherit', px: 0 }}
    >
      {label} {sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
    </Button>
  );
  const pageRows = filtered.slice((page - 1) * 10, page * 10);
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Cari kategori"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          size="small"
          label="Status data"
          value={deletedFilter}
          onChange={(event) => {
            setDeletedFilter(event.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="ACTIVE">Aktif</MenuItem>
          <MenuItem value="DELETED">Terhapus</MenuItem>
          <MenuItem value="ALL">Semua</MenuItem>
        </TextField>
        <RefreshButton />
      </Box>
      <TableContainer sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        {selected.length ? (
          <Box
            component="form"
            action={bulkDeleteFeatureResourceAction}
            sx={{ p: 1.5, bgcolor: 'background.paper' }}
          >
            <input type="hidden" name="resource" value="event-categories" />
            <input
              type="hidden"
              name="permanent"
              value={String(
                selected.every((id) => Boolean(rows.find((row) => row.id === id)?.deleted_at))
              )}
            />
            {selected.map((id) => (
              <input key={id} type="hidden" name="ids" value={id} />
            ))}
            <ConfirmSubmitButton
              title="Hapus kategori terpilih?"
              description={
                selected.every((id) => Boolean(rows.find((row) => row.id === id)?.deleted_at))
                  ? 'Kategori akan dihapus permanen.'
                  : 'Kategori aktif akan dipindahkan ke arsip.'
              }
              color="error"
            >
              {selected.every((id) => Boolean(rows.find((row) => row.id === id)?.deleted_at))
                ? 'Hapus permanen'
                : 'Arsipkan'}{' '}
              {selected.length} data
            </ConfirmSubmitButton>
          </Box>
        ) : null}
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === pageRows.length && pageRows.length > 0}
                  onChange={(e) =>
                    setSelected(e.target.checked ? pageRows.map((row) => row.id) : [])
                  }
                />
              </TableCell>
              <TableCell>{heading('Nama', 'name')}</TableCell>
              <TableCell>{heading('Slug', 'slug')}</TableCell>
              <TableCell>{heading('Deskripsi', 'description')}</TableCell>
              <TableCell>{heading('Dihapus pada', 'deleted_at')}</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={(e) =>
                        setSelected((current) =>
                          e.target.checked
                            ? [...current, row.id]
                            : current.filter((id) => id !== row.id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.slug}</TableCell>
                  <TableCell>{row.description || '-'}</TableCell>
                  <TableCell>
                    {row.deleted_at ? new Date(row.deleted_at).toLocaleString('id-ID') : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {!row.deleted_at ? (
                        <Tooltip title="Edit kategori">
                          <IconButton
                            component={RouterLink}
                            href={`/dashboard/event-categories/${row.id}/edit`}
                            aria-label="Edit kategori"
                            size="small"
                          >
                            <Iconify icon="solar:pen-new-square-linear" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      {row.deleted_at ? (
                        <Box component="form" action={permanentDeleteEventCategoryAction}>
                          <input type="hidden" name="id" value={row.id} />
                          <Tooltip title="Hapus permanen">
                            <span>
                              <ConfirmSubmitButton
                                iconOnly
                                size="small"
                                aria-label="Hapus permanen"
                                title="Hapus permanen?"
                                description="Data tidak dapat dipulihkan."
                                color="error"
                              >
                                <Iconify icon="solar:trash-bin-trash-linear" />
                              </ConfirmSubmitButton>
                            </span>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Box
                          component="form"
                          action={action}
                          onSubmit={() => {
                            document.cookie =
                              'event_category_flash=; Max-Age=0; path=/dashboard/event-categories';
                          }}
                        >
                          <input type="hidden" name="id" value={row.id} />
                          <Tooltip title="Hapus kategori">
                            <span>
                              <ConfirmSubmitButton
                                title="Hapus kategori?"
                                description="Kategori yang dihapus tidak dapat dipulihkan."
                                color="error"
                                variant="text"
                                disabled={pending}
                                aria-label="Hapus kategori"
                                iconOnly
                                size="small"
                              >
                                <Iconify icon="solar:trash-bin-trash-linear" />
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
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {debounced ? 'Kategori tidak ditemukan.' : 'Belum ada kategori event.'}
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
