import { redirect } from 'next/navigation';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Logo } from 'src/components/logo';
import { ColorModeButton } from 'src/components/color-mode-button';

import { isAdminSession } from 'src/auth/types';
import { getServerSession } from 'src/auth/server';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (session)
    redirect(isAdminSession(session) ? paths.dashboard.root : paths.participant.dashboard);

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { lg: 'minmax(480px, 0.9fr) minmax(560px, 1.1fr)' },
      }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          p: { xs: 3, md: 6 },
          display: { xs: 'none', lg: 'flex' },
          position: 'relative',
          overflow: 'hidden',
          color: 'common.white',
          bgcolor: 'grey.900',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Logo sx={{ '& span:last-child': { color: 'common.white' } }} />
        <Box sx={{ maxWidth: 560, position: 'relative', zIndex: 1 }}>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>
            Workspace event kampus
          </Typography>
          <Typography variant="h1" sx={{ mt: 1.5 }}>
            Setiap event, tertata dalam satu alur.
          </Typography>
          <Typography sx={{ mt: 2, color: 'grey.400', maxWidth: 480 }}>
            Kelola publikasi, peserta, pembayaran, presensi, hingga sertifikat dengan konteks tenant
            yang aman.
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'grey.500' }}>
          SITIVENT · Sistem informasi event universitas
        </Typography>
        <Box
          aria-hidden="true"
          sx={{
            width: 440,
            height: 440,
            right: -180,
            bottom: -160,
            position: 'absolute',
            border: '80px solid',
            borderColor: 'primary.main',
            borderRadius: '50%',
            opacity: 0.7,
          }}
        />
      </Box>
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: { xs: 2, sm: 5 } }}>
        <Box sx={{ top: 20, right: 20, position: 'absolute' }}>
          <ColorModeButton />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Logo sx={{ display: { lg: 'none' }, mb: 5 }} />
          {children}
        </Box>
      </Box>
    </Box>
  );
}
