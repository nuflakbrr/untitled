'use client';

import { useActionState, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { RouterLink } from 'src/routes/components';
import { useRouter } from 'next/navigation';

import { adminCrudAction, updateRolePermissionsAction } from 'src/auth/actions';

export function AdminResourceForm({
  resource,
  routeResource = resource,
  id = '',
  initial = {},
  permissions = [],
  assignedPermissionIDs = [],
  tenants = [],
  roles = [],
  isSuperAdmin = true,
  readOnly = false,
}: {
  resource: string;
  routeResource?: string;
  id?: string;
  initial?: Record<string, string | null | boolean | undefined>;
  permissions?: { id: string; name: string; description?: string | null }[];
  assignedPermissionIDs?: string[];
  tenants?: { id: string; name: string; type: string }[];
  roles?: { id: string; name: string }[];
  /** Non-superadmin tenant admins get a trimmed tenant form: no ROOT option,
   * no parent picker (the backend always forces parent to their own tenant). */
  isSuperAdmin?: boolean;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [roleValue, setRoleValue] = useState(String(initial.role || 'peserta'));
  const [state, action, pending] = useActionState(adminCrudAction, { error: '', success: '' });
  const [permissionState, permissionAction, permissionPending] = useActionState(
    updateRolePermissionsAction,
    { error: '', success: '' }
  );
  useEffect(() => {
    if (!state.success && !permissionState.success) return;
    const timer = window.setTimeout(() => router.push(`/dashboard/access/${routeResource}`), 700);
    return () => window.clearTimeout(timer);
  }, [permissionState.success, routeResource, router, state.success]);
  return (
    <Paper variant="outlined" sx={{ p: 3, maxWidth: 900 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {id ? 'Edit data' : 'Tambah data'}
      </Typography>
      {state.error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      ) : null}
      {state.success ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.success}
        </Alert>
      ) : null}
      <Box
        component="form"
        action={action}
        sx={{ display: 'grid', gap: 2, gridTemplateColumns: { md: 'repeat(2, 1fr)' } }}
      >
        <input type="hidden" name="resource" value={resource} />
        <input type="hidden" name="id" value={id} />
        <TextField name="name" label="Nama" required defaultValue={initial.name} />
        <TextField name="description" label="Deskripsi" defaultValue={initial.description} />
        {resource === 'users' ? (
          <>
            <TextField name="email" label="Email" required={!id} defaultValue={initial.email} />
            <TextField name="password" label="Password" type="password" required={!id} />
            <FormControl required>
              <InputLabel id="user-role-label">Role</InputLabel>
              <Select
                labelId="user-role-label"
                name="role"
                label="Role"
                value={roleValue}
                onChange={(event) => setRoleValue(event.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ gridColumn: { md: '1 / -1' } }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Organisasi pengguna
              </Typography>
              <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { md: 'repeat(2, 1fr)' } }}>
                {tenants.map((tenant) => (
                  <label key={tenant.id}>
                    <input
                      type="checkbox"
                      name="tenant_ids"
                      value={tenant.id}
                      defaultChecked={tenant.id === initial.tenant_id}
                    />{' '}
                    {tenant.name}
                  </label>
                ))}
              </Box>
            </Box>
          </>
        ) : null}
        {resource === 'tenants' ? (
          <>
            <FormControl required>
              <InputLabel id="tenant-type-label">Jenis organisasi</InputLabel>
              <Select
                labelId="tenant-type-label"
                name="type"
                label="Jenis organisasi"
                defaultValue={initial.type || 'FACULTY'}
              >
                {isSuperAdmin ? <MenuItem value="ROOT">Root</MenuItem> : null}
                <MenuItem value="FACULTY">Fakultas</MenuItem>
                <MenuItem value="DEPARTMENT">Departemen</MenuItem>
                <MenuItem value="UNIT">Unit</MenuItem>
              </Select>
            </FormControl>
            <TextField name="slug" label="Nama URL" required defaultValue={initial.slug} />
            <TextField name="code" label="Kode organisasi" required defaultValue={initial.code} />
            {isSuperAdmin ? (
              <FormControl>
                <InputLabel id="parent-tenant-label">Organisasi induk</InputLabel>
                <Select
                  labelId="parent-tenant-label"
                  name="parent_id"
                  label="Organisasi induk"
                  defaultValue={initial.parent_id || ''}
                >
                  <MenuItem value="">Tidak ada organisasi induk</MenuItem>
                  {tenants
                    .filter((tenant) => tenant.id !== id)
                    .map((tenant) => (
                      <MenuItem key={tenant.id} value={tenant.id}>
                        {tenant.name} ({tenant.type})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Organisasi induk: otomatis di bawah organisasi Anda sendiri.
                </Typography>
              </Box>
            )}
          </>
        ) : null}
        {resource === 'roles' && !id ? (
          <Box sx={{ gridColumn: { md: '1 / -1' } }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Hak akses peran
            </Typography>
            <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { md: 'repeat(2, 1fr)' } }}>
              {permissions.map((permission) => (
                <label key={permission.id}>
                  <input
                    type="checkbox"
                    name="permission_ids"
                    value={permission.id}
                    defaultChecked={assignedPermissionIDs.includes(permission.id)}
                    disabled={readOnly}
                  />{' '}
                  {permission.name}
                </label>
              ))}
            </Box>
          </Box>
        ) : null}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={pending}>
            Simpan
          </Button>
          <Button component={RouterLink} href={`/dashboard/access/${routeResource}`}>
            Batal
          </Button>
        </Box>
      </Box>
      {resource === 'roles' && id ? (
        <Box component="form" action={permissionAction} sx={{ mt: 4 }}>
          <input type="hidden" name="role_id" value={id} />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Hak akses peran
          </Typography>
          <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: { md: 'repeat(2, 1fr)' } }}>
            {permissions.map((permission) => (
              <label key={permission.id}>
                <input
                  type="checkbox"
                  name="permission_ids"
                  value={permission.id}
                  defaultChecked={assignedPermissionIDs.includes(permission.id)}
                  disabled={readOnly}
                />{' '}
                {permission.name}
              </label>
            ))}
          </Box>
          {permissionState.error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {permissionState.error}
            </Alert>
          ) : null}
          {permissionState.success ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              {permissionState.success}
            </Alert>
          ) : null}
          {!readOnly ? (
            <Button type="submit" variant="outlined" disabled={permissionPending} sx={{ mt: 2 }}>
              Simpan hak akses
            </Button>
          ) : null}
        </Box>
      ) : null}
    </Paper>
  );
}
