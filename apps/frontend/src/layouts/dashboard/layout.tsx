'use client';

import type { TenantOption } from 'src/auth/types';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';

import { RouterLink } from 'src/routes/components';

import { useSession, PermissionGuard } from 'src/auth/session-provider';
import { signOutAction, listTenantsAction, switchTenantAction } from 'src/auth/actions';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session } = useSession();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.neutral' }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, mr: { md: 3 } }}>
            SITIVENT
          </Typography>
          <Box component="nav" sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2, flex: 1 }}>
            <Link component={RouterLink} href="/dashboard" color="text.primary" underline="none">
              Ringkasan
            </Link>
            <PermissionGuard permission="admin.access">
              <Link
                component={RouterLink}
                href="/dashboard/events"
                color="text.primary"
                underline="none"
              >
                Event
              </Link>
            </PermissionGuard>
          </Box>
          {session.is_super_admin && <TenantSwitcher />}
          <Avatar
            src={session.user.image ?? undefined}
            alt={session.user.name}
            sx={{ width: 36, height: 36, display: { xs: 'none', md: 'flex' } }}
          >
            {session.user.name.charAt(0)}
          </Avatar>
          <Box component="form" action={signOutAction}>
            <Button type="submit" color="inherit">
              Keluar
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}

function TenantSwitcher() {
  const router = useRouter();
  const { session, setSession } = useSession();
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listTenantsAction().then((result) => {
      setTenants(result.data ?? []);
      setError(result.error ?? '');
    });
  }, []);

  async function change(tenantId: string) {
    if (!tenantId || tenantId === session.tenant?.id) return;
    setError('');
    setLoading(true);
    try {
      const result = await switchTenantAction(tenantId);
      if (!result.data) {
        setError(result.error);
        return;
      }
      setSession(result.data);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tenant gagal diganti');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormControl size="small" sx={{ minWidth: { xs: 130, sm: 180 } }}>
      <Tooltip title={error}>
        <Select
          error={Boolean(error)}
          value={session.tenant?.id ?? ''}
          onChange={(event) => change(event.target.value)}
          displayEmpty
          aria-label="Tenant aktif"
          disabled={loading}
          renderValue={(value) =>
            loading ? (
              <CircularProgress size={18} />
            ) : (
              tenants.find((tenant) => tenant.id === value)?.name ||
              session.tenant?.name ||
              'Pilih tenant'
            )
          }
        >
          {tenants.map((tenant) => (
            <MenuItem key={tenant.id} value={tenant.id}>
              {tenant.name}
            </MenuItem>
          ))}
        </Select>
      </Tooltip>
    </FormControl>
  );
}
