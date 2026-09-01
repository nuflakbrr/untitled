'use client';

import { useMemo, useState, useEffect, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

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
  const [state, action, pending] = useActionState(deleteEventCategoryAction, {
    error: '',
    success: '',
  });
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        `${row.name} ${row.slug} ${row.description ?? ''}`
          .toLowerCase()
          .includes(debounced.toLowerCase())
      ),
    [rows, debounced]
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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Deskripsi</TableCell>
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
                    <Button
                      component={RouterLink}
                      href={`/dashboard/event-categories/${row.id}/edit`}
                      size="small"
                    >
                      Edit
                    </Button>
                    <Box
                      component="form"
                      action={action}
                      onSubmit={() => {
                        document.cookie =
                          'event_category_flash=; Max-Age=0; path=/dashboard/event-categories';
                      }}
                    >
                      <input type="hidden" name="id" value={row.id} />
                      <ConfirmSubmitButton
                        title="Hapus kategori?"
                        description="Kategori yang dihapus tidak dapat dipulihkan."
                        color="error"
                        variant="text"
                        disabled={pending}
                      >
                        Hapus
                      </ConfirmSubmitButton>
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
