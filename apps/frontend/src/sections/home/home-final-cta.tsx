import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export function FinalCta() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 11 },
        color: 'common.white',
        bgcolor: 'grey.900',
        backgroundImage: 'linear-gradient(135deg, rgba(54,89,217,.16), transparent 55%)',
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            alignItems: 'center',
            gridTemplateColumns: { md: '1fr auto' },
          }}
        >
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.light' }}>
              Dapatkan sertifikat digital
            </Typography>
            <Typography variant="h2" sx={{ mt: 1, maxWidth: 700 }}>
              Ikuti event, tingkatkan kompetensi, raih sertifikat resmi.
            </Typography>
            <Typography sx={{ mt: 1.5, color: 'grey.400' }}>
              Gratis daftar akun. Bayar hanya untuk event yang kamu pilih.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              component={RouterLink}
              href={paths.auth.signUp}
              variant="contained"
              size="large"
            >
              Buat Akun Gratis
            </Button>
            <Button component="a" href="#events" color="white" variant="outlined" size="large">
              Jelajahi Event
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
