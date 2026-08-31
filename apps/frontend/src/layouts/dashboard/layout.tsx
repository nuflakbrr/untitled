'use client';

import type { MyTenant } from 'src/auth/types';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
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
import { ConfirmAction } from 'src/components/confirm-action';
import { ColorModeButton } from 'src/components/color-mode-button';

import { isAdminSession } from 'src/auth/types';
import { useSession, PermissionGuard } from 'src/auth/session-provider';
import { signOutAction, switchTenantAction, listMyTenantsAction } from 'src/auth/actions';

const NAV_WIDTH = 280;

function formatRole(role: string) {
  return role.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const title = pathname.startsWith(paths.dashboard.events)
    ? 'Event'
    : pathname.startsWith(paths.dashboard.permissions)
      ? 'Permission'
      : pathname.startsWith(paths.dashboard.roles)
        ? 'Role'
        : pathname.startsWith(paths.dashboard.tenants)
          ? 'Organisasi'
          : pathname.startsWith(paths.dashboard.users)
            ? 'Akun pengguna'
            : pathname.startsWith(paths.participant.dashboard)
              ? 'Dashboard peserta'
              : pathname.startsWith(paths.participant.transactions)
                ? 'Riwayat transaksi'
                : pathname.startsWith(paths.participant.certificates)
                  ? 'Sertifikat saya'
                  : pathname.startsWith(paths.participant.profile)
                    ? 'Profil saya'
                    : 'Ringkasan';

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
              Beranda / {title}
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
  const { session, can } = useSession();
  const isAdmin = isAdminSession(session);
  const dashboardPath = isAdmin ? paths.dashboard.root : paths.participant.dashboard;
  const accessMenuItems = [
    { permission: 'permission.read', href: paths.dashboard.permissions, label: 'Hak akses' },
    { permission: 'role.read', href: paths.dashboard.roles, label: 'Peran pengguna' },
    { permission: 'tenant.read', href: paths.dashboard.tenants, label: 'Organisasi' },
    { permission: 'user.read', href: paths.dashboard.users, label: 'Akun pengguna' },
  ];
  const hasAccessMenu = isAdmin && accessMenuItems.some((item) => can(item.permission));

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Logo />
      </Box>
      {isAdmin ? (
        <Box sx={{ px: 2.5, pb: 2 }}>
          <TenantSwitcher />
        </Box>
      ) : null}
      <Divider />
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        <Typography
          variant="overline"
          color="text.disabled"
          sx={{ px: 1.5, display: 'block', mb: 1 }}
        >
          Menu utama
        </Typography>
        <NavItem
          href={dashboardPath}
          label={isAdmin ? 'Ringkasan' : 'Dashboard peserta'}
          icon="solar:home-angle-linear"
          active={pathname === dashboardPath || pathname === `${dashboardPath}/`}
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
        {hasAccessMenu ? (
          <>
            <Typography
              variant="overline"
              color="text.disabled"
              sx={{ px: 1.5, display: 'block', mt: 2.5, mb: 1 }}
            >
              Pengaturan akses
            </Typography>
            {accessMenuItems.map((item) => (
              <PermissionGuard key={item.permission} permission={item.permission}>
                <NavItem
                  href={item.href}
                  label={item.label}
                  icon="solar:user-id-bold"
                  active={pathname.startsWith(item.href)}
                  onClick={onNavigate}
                />
              </PermissionGuard>
            ))}
          </>
        ) : null}
        {!isAdmin ? (
          <>
            <NavItem
              href={paths.participant.transactions}
              label="Riwayat transaksi"
              icon="solar:card-outline"
              active={pathname.startsWith(paths.participant.transactions)}
              onClick={onNavigate}
            />
            <NavItem
              href={paths.participant.certificates}
              label="Sertifikat"
              icon="solar:diploma-verified-bold-duotone"
              active={pathname.startsWith(paths.participant.certificates)}
              onClick={onNavigate}
            />
            <NavItem
              href={paths.participant.profile}
              label="Profil saya"
              icon="solar:user-id-bold"
              active={pathname.startsWith(paths.participant.profile)}
              onClick={onNavigate}
            />
          </>
        ) : null}
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
            <Chip
              label={formatRole(session.user.role)}
              size="small"
              color="primary"
              variant="soft"
              sx={{ maxWidth: '100%', textTransform: 'capitalize' }}
            />
          </Box>
        </Box>
        <Box>
          <ConfirmAction
            label="Keluar"
            title="Keluar dari akun?"
            description="Kamu perlu login kembali untuk mengakses dashboard."
            action={signOutAction}
            startIcon={<Iconify icon="carbon:logout" width={19} />}
          />
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
  icon:
    | 'solar:home-angle-linear'
    | 'solar:calendar-mark-outline'
    | 'solar:card-outline'
    | 'solar:diploma-verified-bold-duotone'
    | 'solar:user-id-bold';
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
  const [tenants, setTenants] = useState<MyTenant[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const tenantOptions =
    session.tenant && !tenants.some((tenant) => tenant.tenant_id === session.tenant?.id)
      ? [
          {
            tenant_id: session.tenant.id,
            tenant_name: session.tenant.name,
            tenant_slug: session.tenant.slug,
            tenant_code: session.tenant.code,
            tenant_type: session.tenant.type,
          },
          ...tenants,
        ]
      : tenants;

  useEffect(() => {
    listMyTenantsAction().then((result) => {
      setTenants(result.data ?? []);
      setError(result.error ?? '');
      setReady(true);
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

  // Only one organization to be in: show it as plain text, no picker needed.
  if (ready && tenantOptions.length <= 1) {
    return (
      <Box sx={{ p: 1.75, bgcolor: 'background.neutral', borderRadius: 1.2 }}>
        <Typography variant="caption" color="text.secondary">
          Organisasi aktif
        </Typography>
        <Typography variant="subtitle2" noWrap>
          {session.tenant?.name ?? 'Universitas'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
        Organisasi aktif
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
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.4,
                  }}
                >
                  {tenantOptions.find((tenant) => tenant.tenant_id === value)?.tenant_name ||
                    session.tenant?.name ||
                    'Pilih organisasi'}
                </Box>
              )
            }
          >
            {tenantOptions.map((tenant) => (
              <MenuItem key={tenant.tenant_id} value={tenant.tenant_id}>
                {tenant.tenant_name}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl>
    </Box>
  );
}
