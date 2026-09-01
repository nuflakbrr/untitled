'use client';

import { useMemo, useState, useEffect, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import { deleteEventCategoryAction } from 'src/auth/actions';

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  tenant_id?: string | null;
};

export function EventCategoryTable({ rows }: { rows: Category[] }) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: keyof Category; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });
  const [state, action, pending] = useActionState(deleteEventCategoryAction, {
    error: '',
    success: '',
  });
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  const filtered = useMemo(() => {
    const result = rows.filter((row) =>
      `${row.name} ${row.slug} ${row.description ?? ''}`
        .toLowerCase()
        .includes(debounced.toLowerCase())
    );
    return result.sort(
      (a, b) =>
        String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? '')) *
        (sort.direction === 'asc' ? 1 : -1)
    );
  }, [rows, debounced, sort]);
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
      <TextField
        size="small"
        label="Cari kategori"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setPage(1);
        }}
      />
      <TableContainer sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>{heading('Nama', 'name')}</TableCell>
              <TableCell>{heading('Slug', 'slug')}</TableCell>
              <TableCell>{heading('Deskripsi', 'description')}</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.slug}</TableCell>
                <TableCell>{row.description || '-'}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
