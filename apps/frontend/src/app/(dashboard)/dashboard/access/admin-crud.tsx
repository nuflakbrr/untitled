'use client';

import { useMemo, useState, useEffect, useActionState } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Pagination from '@mui/material/Pagination';
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

import { toggleUserBanAction, deleteAdminResourceAction } from 'src/auth/actions';

export type Row = {
  id: string;
  name: string;
  description?: string | null;
  email?: string;
  role?: string;
  type?: string;
  slug?: string;
  code?: string;
  banned?: boolean;
};
export function AdminCrud({
  resource,
  rows,
  currentUserId,
  currentUserRoleId,
}: {
  resource: string;
  rows: Row[];
  currentUserId?: string;
  currentUserRoleId?: string;
}) {
  const routeResource = resource === 'roles/permissions' ? 'permissions' : resource;
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAdminResourceAction, {
    error: '',
    success: '',
  });
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);
  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [rows, debouncedQuery]
  );
  const pageRows = filtered.slice((page - 1) * 10, page * 10);
  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {deleteState.error ? <Alert severity="error">{deleteState.error}</Alert> : null}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Cari"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        />
        <Button
          component={RouterLink}
          href={`/dashboard/access/${routeResource}/create`}
          variant="contained"
        >
          Tambah data
        </Button>
      </Box>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row) => {
              const roleLocked =
                resource === 'roles' &&
                (row.id === currentUserRoleId || row.name === 'root_superadmin');
              return (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {row.email || row.description || row.type || row.code || '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {!roleLocked ? (
                        <Button
                          component={RouterLink}
                          href={`/dashboard/access/${routeResource}/${row.id}/edit`}
                          size="small"
                        >
                          Edit
                        </Button>
                      ) : null}
                      {resource === 'users' && row.id !== currentUserId ? (
                        <Box component="form" action={toggleUserBanAction}>
                          <input type="hidden" name="id" value={row.id} />
                          <input type="hidden" name="banned" value={String(Boolean(row.banned))} />
                          <Button
                            type="submit"
                            color={row.banned ? 'success' : 'warning'}
                            size="small"
                          >
                            {row.banned ? 'Aktifkan' : 'Nonaktifkan'}
                          </Button>
                        </Box>
                      ) : null}
                      {!roleLocked ? (
                        <Box component="form" action={deleteAction}>
                          <input type="hidden" name="resource" value={resource} />
                          <input type="hidden" name="id" value={row.id} />
                          <Button type="submit" color="error" size="small" disabled={deletePending}>
                            Hapus
                          </Button>
                        </Box>
                      ) : null}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
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
