import type { PublicGallery } from 'src/lib/api/events';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export function Gallery({ galleries }: { galleries: PublicGallery[] }) {
  return (
    <Box component="section" sx={{ py: { xs: 9, md: 13 } }}>
      <Container>
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" color="primary.main">
            Dokumentasi kegiatan
          </Typography>
          <Typography variant="h2" sx={{ mt: 1 }}>
            Kilas Balik Kemeriahan Event
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Momen-momen terbaik dari berbagai kegiatan kami.
          </Typography>
        </Box>
        {galleries.length ? (
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: { xs: '1fr 1fr', md: '1.45fr .7fr .7fr' },
              gridTemplateRows: { md: '1fr 1fr' },
            }}
          >
            {galleries.slice(0, 4).map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  minHeight: { xs: 150, md: index === 0 ? 420 : 200 },
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 1.5,
                  gridRow: { md: index === 0 ? 'span 2' : 'auto' },
                }}
              >
                <Box
                  component="img"
                  src={item.image_url}
                  alt={item.title}
                  sx={{ width: '100%', height: '100%', position: 'absolute', objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    inset: 0,
                    position: 'absolute',
                    display: 'flex',
                    p: 2,
                    color: 'common.white',
                    justifyContent: 'flex-end',
                    flexDirection: 'column',
                    background: 'linear-gradient(transparent 30%, rgba(0,0,0,.7))',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    DOKUMENTASI
                  </Typography>
                  <Typography variant="subtitle1">{item.title}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">Belum ada dokumentasi kegiatan.</Typography>
        )}
      </Container>
    </Box>
  );
}
