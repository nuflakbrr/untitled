'use client';

import { useMemo, useState, useEffect, useActionState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { RefreshButton } from 'src/components/refresh-button';
import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import { deleteGalleryAction, bulkDeleteFeatureResourceAction } from 'src/auth/actions';

type Gallery = {
  id: string;
  title: string;
  description?: string | null;
  image_url: string;
  featured: boolean;
};
export function GalleryTable({ rows }: { rows: Gallery[] }) {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [, action, pending] = useActionState(deleteGalleryAction, { error: '', success: '' });
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);
  const data = useMemo(
    () =>
      rows
        .filter((r) =>
          `${r.title} ${r.description ?? ''}`.toLowerCase().includes(debounced.toLowerCase())
        )
        .sort((a, b) => a.title.localeCompare(b.title) * (direction === 'asc' ? 1 : -1)),
    [rows, debounced, direction]
  );
  const items = data.slice((page - 1) * 10, page * 10);
  const selectedOnPage = items.filter((item) => selected.includes(item.id));
  const allOnPageSelected = items.length > 0 && selectedOnPage.length === items.length;
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  const heading = (label: string) => (
    <Button
      onClick={() => setDirection((v) => (v === 'asc' ? 'desc' : 'asc'))}
      sx={{ fontWeight: 700, color: 'inherit', px: 0 }}
    >
      {label} {direction === 'asc' ? '↑' : '↓'}
    </Button>
  );
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Cari galeri"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          sx={{ flex: 1 }}
        />
        <RefreshButton />
      </Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 1.5, overflow: 'hidden' }}
      >
        {selected.length ? (
          <Box
            component="form"
            action={bulkDeleteFeatureResourceAction}
            sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: 'background.paper' }}
          >
            <input type="hidden" name="resource" value="galleries" />
            {selected.map((id) => (
              <input key={id} type="hidden" name="ids" value={id} />
            ))}
            <ConfirmSubmitButton
              title="Hapus galeri terpilih?"
              description="Galeri yang dipilih akan dihapus."
              color="error"
            >
              Hapus terpilih ({selected.length})
            </ConfirmSubmitButton>
          </Box>
        ) : null}
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allOnPageSelected}
                  indeterminate={selectedOnPage.length > 0 && !allOnPageSelected}
                  onChange={() =>
                    setSelected(
                      allOnPageSelected
                        ? selected.filter((id) => !items.some((item) => item.id === id))
                        : [...new Set([...selected, ...items.map((item) => item.id)])]
                    )
                  }
                />
              </TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>{heading('Judul')}</TableCell>
              <TableCell>{heading('Deskripsi')}</TableCell>
              <TableCell>Unggulan</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length ? (
              items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(r.id)} onChange={() => toggle(r.id)} />
                  </TableCell>
                  <TableCell>
                    <Box
                      component="img"
                      src={r.image_url}
                      alt={r.title}
                      sx={{ width: 72, height: 48, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.description || '-'}</TableCell>
                  <TableCell>{r.featured ? 'Ya' : 'Tidak'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit galeri">
                      <IconButton
                        component={RouterLink}
                        href={`/dashboard/galleries/${r.id}/edit`}
                        size="small"
                        aria-label="Edit galeri"
                      >
                        <Iconify icon="solar:pen-new-square-linear" />
                      </IconButton>
                    </Tooltip>
                    <Box component="form" action={action} sx={{ display: 'inline-flex' }}>
                      <input type="hidden" name="id" value={r.id} />
                      <Tooltip title="Hapus galeri">
                        <span>
                          <ConfirmSubmitButton
                            iconOnly
                            size="small"
                            aria-label="Hapus galeri"
                            title="Hapus galeri?"
                            description="Galeri yang dihapus tidak dapat dipulihkan."
                            color="error"
                            disabled={pending}
                          >
                            <Iconify icon="solar:trash-bin-trash-linear" />
                          </ConfirmSubmitButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {debounced ? 'Galeri tidak ditemukan.' : 'Belum ada galeri.'}
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
          onChange={(_, v) => setPage(v)}
        />
      ) : null}
    </Box>
  );
}
