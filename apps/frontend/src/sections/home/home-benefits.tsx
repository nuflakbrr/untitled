import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const benefits = [
  [
    'solar:double-alt-arrow-up-bold-duotone',
    'Konfirmasi Cepat',
    'Registrasi instan dan QR code untuk event offline.',
    'primary',
  ],
  [
    'solar:shield-check-outline',
    'Data Aman',
    'Informasi peserta tersimpan aman dan privat.',
    'success',
  ],
  [
    'solar:documents-minimalistic-outline',
    'Sertifikat Resmi',
    'e-Certificate resmi yang dapat diunduh kapan saja.',
    'secondary',
  ],
  [
    'solar:documents-minimalistic-outline',
    'Materi Berkualitas',
    'Materi event terstruktur dari instruktur berpengalaman.',
    'info',
  ],
  [
    'solar:cup-star-linear',
    'Narasumber Ekspert',
    'Belajar langsung dari praktisi terbaik di bidangnya.',
    'warning',
  ],
  [
    'solar:users-group-rounded-outline',
    'Jaringan Koneksi',
    'Perluas relasi dan kolaborasi dengan peserta lain.',
    'error',
  ],
] as const;
export function Benefits() {
  return (
    <Box component="section" sx={{ py: { xs: 9, md: 13 }, bgcolor: 'background.neutral' }}>
      <Container>
        <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 6 }}>
          <Typography variant="h2">Kenapa Harus Ikut Event Disini?</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Keunggulan platform yang dirancang untuk mendukung pertumbuhan karier dan keahlianmu.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {benefits.map(([icon, title, description, color]) => (
            <Box
              key={title}
              sx={{
                p: 2.5,
                display: 'grid',
                gap: 2,
                gridTemplateColumns: '44px 1fr',
                border: '1px solid',
                borderColor: 'divider',
                borderLeft: '4px solid',
                borderLeftColor: `${color}.main`,
                bgcolor: 'background.paper',
                borderRadius: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'common.white',
                  bgcolor: `${color}.main`,
                  borderRadius: 1,
                }}
              >
                <Iconify icon={icon} width={22} />
              </Box>
              <Box>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
