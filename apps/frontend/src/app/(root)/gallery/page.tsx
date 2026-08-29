import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getPublicGalleries } from 'src/lib/api/events';

export const metadata: Metadata = {
  title: 'Galeri | SITIVENT',
  description: 'Dokumentasi kegiatan dan event SITIVENT.',
};

export default async function GalleryPage() {
  const galleries = await getPublicGalleries().catch(() => []);

  return (
    <Container sx={{ pt: { xs: 10, md: 14 }, pb: { xs: 8, md: 13 } }}>
      <Typography variant="overline" color="primary.main">
        Dokumentasi kegiatan
      </Typography>
      <Typography variant="h1" sx={{ mt: 1.5, fontSize: { xs: '2.8rem', md: '4.5rem' } }}>
        Kilas balik event.
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 620 }}>
        Momen-momen terbaik dari seminar, workshop, dan berbagai kegiatan kampus.
      </Typography>
      {galleries.length ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gridAutoRows: { xs: 260, md: 300 },
            gap: 2,
            mt: 6,
          }}
        >
          {galleries.map((item, index) => (
            <Box
              key={item.id}
              component="figure"
              sx={{
                m: 0,
                gridColumn: { md: index % 5 === 0 ? 'span 2' : 'span 1' },
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src={item.image_url}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform .4s',
                  '&:hover': { transform: 'scale(1.04)' },
                }}
              />
              <Box
                component="figcaption"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  p: 2.5,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                  color: 'common.white',
                  background: 'linear-gradient(transparent 35%, rgba(0,0,0,.78))',
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  DOKUMENTASI
                </Typography>
                <Typography variant="h6">{item.title}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography color="text.secondary" sx={{ mt: 6 }}>
          Belum ada dokumentasi kegiatan.
        </Typography>
      )}
    </Container>
  );
}
