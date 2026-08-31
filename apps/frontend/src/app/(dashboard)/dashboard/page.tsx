import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

import { requireSession } from 'src/auth/server';
import { getAdminDashboardDataAction } from 'src/auth/actions';

import { DashboardClock } from './dashboard-clock';
import { DashboardEventRanking } from './dashboard-event-ranking';
import { DashboardRecentRegistrations } from './dashboard-recent-registrations';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await requireSession('admin.access');
  const dashboardResult = await getAdminDashboardDataAction();
  const dashboard = dashboardResult.data;
  const activeEvents =
    dashboard?.events.filter((event) => event.status === 'PUBLISHED').length ?? 0;
  const draftEvents = dashboard?.events.filter((event) => event.status === 'DRAFT').length ?? 0;
  const popularEvents = [...(dashboard?.events ?? [])]
    .sort((a, b) => b.registrations - a.registrations)
    .slice(0, 10);
  const tenantPopularEvents = [...(dashboard?.events ?? [])]
    .filter((event) => event.tenant_id === session.tenant?.id)
    .sort((a, b) => b.registrations - a.registrations)
    .slice(0, 50);

  return (
    <Stack spacing={3}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          overflow: 'hidden',
          position: 'relative',
          color: 'common.white',
          bgcolor: 'grey.900',
        }}
      >
        <Box sx={{ maxWidth: 680, position: 'relative', zIndex: 1 }}>
          <Chip
            label={session.tenant?.name ?? 'Universitas'}
            size="small"
            sx={{ color: 'primary.light', bgcolor: 'rgba(142, 164, 255, 0.12)' }}
          />
          <Typography variant="h2" sx={{ mt: 2 }}>
            Selamat datang, {session.user.name.split(' ')[0]}.
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'grey.400', maxWidth: 560 }}>
            Terimakasih sudah mengelola semua data dengan baik. Anda sangat luar biasa!
          </Typography>
          <Typography sx={{ mt: 3, color: 'grey.400' }}>
            <DashboardClock /> WIB
          </Typography>
        </Box>
        <Box
          aria-hidden="true"
          sx={{
            width: 280,
            height: 280,
            right: -60,
            bottom: -130,
            position: 'absolute',
            border: '48px solid',
            borderColor: 'primary.main',
            borderRadius: '50%',
            opacity: 0.55,
          }}
        />
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr 1fr', xl: 'repeat(4, 1fr)' },
        }}
      >
        {[
          [
            'Total event',
            dashboard?.events.length ?? 0,
            `${activeEvents} Aktif | ${draftEvents} Draft`,
            'solar:calendar-mark-outline',
          ],
          [
            'Total registrasi',
            dashboard?.registrations ?? 0,
            'Data tenant aktif',
            'solar:users-group-rounded-bold-duotone',
          ],
          ['Pendapatan', '—', 'Belum tersedia dari endpoint tenant', 'solar:wallet-money-outline'],
          [
            'Kehadiran',
            '—',
            'Belum tersedia dari endpoint tenant',
            'solar:checklist-minimalistic-outline',
          ],
        ].map(([label, value, detail, icon]) => (
          <Paper key={String(label)} variant="outlined" sx={{ p: { xs: 2.5, md: 3 } }}>
            <Iconify icon={String(icon)} width={28} sx={{ color: 'primary.main' }} />
            <Typography variant="h3" sx={{ mt: 2 }}>
              {value}
            </Typography>
            <Typography>{label}</Typography>
            <Typography variant="caption" color="text.secondary">
              {detail}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { md: '1.6fr 1fr' } }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3 },
            gridRow: { md: 'span 2' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5">Registrasi terbaru</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            Ringkasan registrasi pada event tenant aktif.
          </Typography>
          <DashboardRecentRegistrations registrations={dashboard?.recentRegistrations ?? []} />
        </Paper>
        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, display: 'none' }}>
          <Typography variant="h5">Top 10 Event terpopuler</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            Event dengan jumlah pendaftar terbanyak.
          </Typography>
          <Stack spacing={1.5}>
            {popularEvents.map((event, index) => (
              <Box key={event.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {index < 3 ? (
                    <Iconify
                      icon="carbon:trophy"
                      width={28}
                      sx={{
                        flexShrink: 0,
                        color: ['#D4AF37', '#A7A7A7', '#B87333'][index],
                      }}
                    />
                  ) : null}
                  {index >= 3 ? (
                    <Typography
                      sx={{
                        width: 28,
                        height: 28,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        borderRadius: '50%',
                        fontWeight: 700,
                        bgcolor: index === 0 ? 'primary.main' : 'action.hover',
                        color: index === 0 ? 'primary.contrastText' : 'text.secondary',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  ) : null}
                  <Typography sx={{ flex: 1, minWidth: 0 }} noWrap>
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {event.registrations} pendaftar
                  </Typography>
                </Box>
                <Chip
                  label={event.tenant_type === 'ROOT' ? 'Event universitas' : event.tenant_name}
                  size="small"
                  sx={{
                    display: 'flex',
                    width: 'fit-content',
                    ml: 5.5,
                    mt: 0.5,
                    height: 20,
                    fontSize: 10,
                    textTransform: 'uppercase',
                  }}
                />
                <LinearProgress
                  variant="determinate"
                  value={
                    popularEvents[0]?.registrations
                      ? (event.registrations / popularEvents[0].registrations) * 100
                      : 0
                  }
                  sx={{ ml: 5.5, mt: 0.75, height: 5, borderRadius: 1 }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
        <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: '1fr' }}>
          <DashboardEventRanking
            title="Top 10 Event terpopuler"
            subtitle="Event dengan jumlah pendaftar terbanyak."
            events={popularEvents}
          />
          <DashboardEventRanking
            title="Top 10 event tenant aktif"
            subtitle={`Event dengan pendaftar terbanyak di ${session.tenant?.name ?? 'tenant aktif'}.`}
            events={tenantPopularEvents}
          />
        </Box>
        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, display: 'none' }}>
          <Typography variant="h5">Top 10 event tenant aktif</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
            Event dengan pendaftar terbanyak di {session.tenant?.name ?? 'tenant aktif'}.
          </Typography>
          {tenantPopularEvents.length ? (
            <Stack spacing={1.5}>
              {tenantPopularEvents.map((event, index) => (
                <Box key={event.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {index < 3 ? (
                      <Iconify
                        icon="carbon:trophy"
                        width={28}
                        sx={{ flexShrink: 0, color: ['#D4AF37', '#A7A7A7', '#B87333'][index] }}
                      />
                    ) : (
                      <Typography sx={{ width: 28, textAlign: 'center', fontWeight: 700 }}>
                        {index + 1}
                      </Typography>
                    )}
                    <Typography sx={{ flex: 1, minWidth: 0 }} noWrap>
                      {event.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {event.registrations} pendaftar
                    </Typography>
                  </Box>
                  <Chip
                    label={event.tenant_type === 'ROOT' ? 'Event universitas' : event.tenant_name}
                    size="small"
                    sx={{
                      display: 'flex',
                      width: 'fit-content',
                      ml: 5.5,
                      mt: 0.5,
                      height: 20,
                      fontSize: 10,
                      textTransform: 'uppercase',
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      tenantPopularEvents[0]?.registrations
                        ? (event.registrations / tenantPopularEvents[0].registrations) * 100
                        : 0
                    }
                    sx={{ ml: 5.5, mt: 0.75, height: 5, borderRadius: 1 }}
                  />
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">Belum ada event pada tenant aktif.</Typography>
          )}
        </Paper>
      </Box>
    </Stack>
  );
}
