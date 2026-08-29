import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

export type FooterProps = BoxProps;

export function Footer({ sx, ...other }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={[
        { py: { xs: 6, md: 8 }, bgcolor: 'grey.900', color: 'grey.400' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container sx={{ display: 'grid', gap: 4 }}>
        <Box
          sx={{
            gap: 4,
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box>
            <Logo sx={{ '& span:last-child': { color: 'common.white' } }} />
            <Typography variant="body2" sx={{ mt: 1.5, maxWidth: 360 }}>
              Satu pintu untuk menemukan dan mengelola event universitas.
            </Typography>
          </Box>
          <Box component="nav" aria-label="Navigasi footer" sx={{ display: 'flex', gap: 3 }}>
            <Link component={RouterLink} href={paths.event.root} color="inherit" underline="hover">
              Event
            </Link>
            <Link component={RouterLink} href={paths.gallery} color="inherit" underline="hover">
              Galeri
            </Link>
            <Link
              component={RouterLink}
              href={paths.article.root}
              color="inherit"
              underline="hover"
            >
              Artikel
            </Link>
            <Link component={RouterLink} href={paths.auth.signIn} color="inherit" underline="hover">
              Masuk
            </Link>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{ pt: 3, borderTop: '1px solid', borderColor: 'grey.800' }}
        >
          © 2026 SITIVENT. Sistem informasi event universitas.
        </Typography>
      </Container>
    </Box>
  );
}
