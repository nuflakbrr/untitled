'use client';

import type { TenantOption } from 'src/auth/types';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { ColorModeButton } from 'src/components/color-mode-button';

import { useSession, PermissionGuard } from 'src/auth/session-provider';
import { signOutAction, listTenantsAction, switchTenantAction } from 'src/auth/actions';

const NAV_WIDTH = 280;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = pathname.startsWith(paths.dashboard.events) ? 'Event' : 'Ringkasan';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          ml: { lg: `${NAV_WIDTH}px` },
          width: { lg: `calc(100% - ${NAV_WIDTH}px)` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 72, md: 80 }, px: { xs: 2, md: 4 } }}>
          <IconButton
            aria-label="Buka navigasi"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { lg: 'none' }, mr: 1 }}
          >
            <Iconify icon="solar:hamburger-menu-linear" />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Workspace / {title}
            </Typography>
            <Typography variant="h5">{title}</Typography>
          </Box>
          <ColorModeButton />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        slotProps={{ paper: { sx: { width: NAV_WIDTH } } }}
        sx={{ display: { xs: 'block', lg: 'none' } }}
      >
        <DashboardNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        component="aside"
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          width: NAV_WIDTH,
          position: 'fixed',
          display: { xs: 'none', lg: 'block' },
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <DashboardNav pathname={pathname} />
      </Box>

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          ml: { lg: `${NAV_WIDTH}px` },
          pt: { xs: '72px', md: '80px' },
          minHeight: '100vh',
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1440, mx: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}

function DashboardNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const { session } = useSession();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Logo />
      </Box>
      <Box sx={{ px: 2.5, pb: 2 }}>
        {session.is_super_admin ? (
          <TenantSwitcher />
        ) : (
          <Box sx={{ p: 1.75, bgcolor: 'background.neutral', borderRadius: 1.2 }}>
            <Typography variant="caption" color="text.secondary">
              Tenant aktif
            </Typography>
            <Typography variant="subtitle2" noWrap>
              {session.tenant?.name ?? 'Universitas'}
            </Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        <NavItem
          href={paths.dashboard.root}
          label="Ringkasan"
          icon="solar:home-angle-linear"
          active={pathname === paths.dashboard.root || pathname === `${paths.dashboard.root}/`}
          onClick={onNavigate}
        />
        <PermissionGuard permission="admin.access">
          <NavItem
            href={paths.dashboard.events}
            label="Event"
            icon="solar:calendar-mark-outline"
            active={pathname.startsWith(paths.dashboard.events)}
            onClick={onNavigate}
          />
        </PermissionGuard>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', px: 1, pb: 2 }}>
          <Avatar src={session.user.image ?? undefined} alt={session.user.name}>
            {session.user.name.charAt(0)}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {session.user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {session.user.role}
            </Typography>
          </Box>
        </Box>
        <Box component="form" action={signOutAction}>
          <ListItemButton component="button" type="submit" sx={{ width: '100%', borderRadius: 1 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Iconify icon="carbon:logout" width={19} />
            </ListItemIcon>
            <ListItemText primary="Keluar" slotProps={{ primary: { variant: 'body2' } }} />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );
}

function NavItem({
  href,
  label,
  icon,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: 'solar:home-angle-linear' | 'solar:calendar-mark-outline';
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <ListItemButton
      component={RouterLink}
      href={href}
      selected={active}
      onClick={onClick}
      sx={{ mb: 0.5, borderRadius: 1, '&.Mui-selected': { color: 'primary.main' } }}
    >
      <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
        <Iconify icon={icon} width={20} />
      </ListItemIcon>
      <ListItemText
        primary={label}
        slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 600 } } }}
      />
    </ListItemButton>
  );
}

function TenantSwitcher() {
  const router = useRouter();
  const { session, setSession } = useSession();
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const tenantOptions =
    session.tenant && !tenants.some((tenant) => tenant.id === session.tenant?.id)
      ? [session.tenant, ...tenants]
      : tenants;

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
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Tenant aktif
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      <FormControl size="small" fullWidth>
        <Tooltip title={error}>
          <Select
            error={Boolean(error)}
            value={session.tenant?.id ?? ''}
            onChange={(event) => change(event.target.value)}
            displayEmpty
            aria-label="Tenant aktif"
            disabled={loading}
            sx={{
              height: 48,
              display: 'flex',
              alignItems: 'center',
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                height: '48px',
                boxSizing: 'border-box',
                pr: 5,
                py: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              '& .MuiSelect-icon': {
                top: '50%',
                transform: 'translateY(-50%)',
              },
            }}
            renderValue={(value) =>
              loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={18} />
                </Box>
              ) : (
                <Box
                  component="span"
                  sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}
                >
                  {tenantOptions.find((tenant) => tenant.id === value)?.name ||
                    session.tenant?.name ||
                    'Pilih tenant'}
                </Box>
              )
            }
          >
            {tenantOptions.map((tenant) => (
              <MenuItem key={tenant.id} value={tenant.id}>
                {tenant.name}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl>
    </Box>
  );
}
