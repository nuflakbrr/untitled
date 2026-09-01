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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { RouterLink } from 'src/routes/components';

import { toggleUserBanAction, deleteAdminResourceAction } from 'src/auth/actions';
import { Iconify } from 'src/components/iconify';

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
                        <Tooltip title="Edit">
                        <IconButton
                          component={RouterLink}
                          href={`/dashboard/access/${routeResource}/${row.id}/edit`}
                          aria-label="Edit"
                          size="small"
                        >
                          <Iconify icon="solar:pen-new-square-linear" />
                        </IconButton>
                        </Tooltip>
                      ) : null}
                      {resource === 'users' && row.id !== currentUserId ? (
                        <Box component="form" action={toggleUserBanAction}>
                          <input type="hidden" name="id" value={row.id} />
                          <input type="hidden" name="banned" value={String(Boolean(row.banned))} />
                          <Tooltip title={row.banned ? 'Aktifkan akun' : 'Nonaktifkan akun'}>
                          <IconButton
                            type="submit"
                            color={row.banned ? 'success' : 'warning'}
                            aria-label={row.banned ? 'Aktifkan akun' : 'Nonaktifkan akun'}
                            size="small"
                          >
                            <Iconify icon={row.banned ? 'solar:user-check-linear' : 'solar:user-block-linear'} />
                          </IconButton>
                          </Tooltip>
                        </Box>
                      ) : null}
                      {!roleLocked ? (
                        <Box component="form" action={deleteAction}>
                          <input type="hidden" name="resource" value={resource} />
                          <input type="hidden" name="id" value={row.id} />
                          <Tooltip title="Hapus">
                          <IconButton type="submit" color="error" aria-label="Hapus" size="small" disabled={deletePending}>
                            <Iconify icon="solar:trash-bin-trash-linear" />
                          </IconButton>
                          </Tooltip>
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
