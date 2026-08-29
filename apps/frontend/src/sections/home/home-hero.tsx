import type { PublicEvent } from 'src/lib/api/events';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { Meta, formatDate } from './home-meta';

export function Hero({
  event,
  isAuthenticated = false,
  total,
  activeIndex,
  onChange,
}: {
  event?: PublicEvent;
  isAuthenticated?: boolean;
  total: number;
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  return (
    <Box component="section" sx={{ pt: { xs: 13, md: 16 }, pb: { xs: 8, md: 10 } }}>
      <Container>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 5, md: 7 },
            alignItems: 'center',
            gridTemplateColumns: { md: 'minmax(0, .85fr) minmax(440px, 1.15fr)' },
          }}
        >
          <Box>
            <Typography variant="overline" color="primary.main">
              Event kampus
            </Typography>
            <Typography
              variant="h1"
              sx={{
                mt: 1.5,
                maxWidth: 560,
                minHeight: { xs: 76, md: 112 },
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.08,
                letterSpacing: -1.2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {event?.title ?? 'Temukan event kampusmu.'}
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mt: 2.5, maxWidth: 560, fontWeight: 400, lineHeight: 1.6 }}
            >
              {event?.description ??
                'Belum ada event yang tersedia saat ini. Kembali lagi untuk melihat agenda terbaru.'}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
              <Button
                component={RouterLink}
                href={
                  isAuthenticated && event ? paths.event.details(event.slug) : paths.auth.signUp
                }
                variant="contained"
                size="large"
                disabled={!event}
              >
                {isAuthenticated ? 'Lihat detail event' : 'Daftar sekarang'}
              </Button>
              {!isAuthenticated && (
                <Button
                  component={RouterLink}
                  href={paths.event.root}
                  variant="outlined"
                  size="large"
                >
                  Lihat semua event
                </Button>
              )}
            </Stack>
            {event && (
              <Stack direction="row" spacing={2.5} sx={{ mt: 4 }}>
                <Meta icon="solar:calendar-date-linear" value={formatDate(event.start_date)} />
                <Meta
                  icon="solar:clock-circle-outline"
                  value={`${event.start_time.slice(0, 5)} WIB`}
                />
              </Stack>
            )}
            {total > 1 && (
              <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
                {Array.from({ length: total }).map((_, index) => (
                  <Box
                    key={index}
                    component="button"
                    aria-label={`Tampilkan event ${index + 1}`}
                    onClick={() => onChange(index)}
                    sx={{
                      width: index === activeIndex ? 36 : 10,
                      height: 10,
                      p: 0,
                      border: 0,
                      cursor: 'pointer',
                      borderRadius: 10,
                      bgcolor: index === activeIndex ? 'primary.main' : 'divider',
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
          <Box sx={{ minHeight: { xs: 300, md: 570 }, position: 'relative' }}>
            {event?.banner ? (
              <>
                <Box
                  component="img"
                  src={event.banner}
                  alt={`Poster ${event.title}`}
                  sx={{
                    width: '100%',
                    height: { xs: 390, md: 570 },
                    display: 'block',
                    objectFit: 'cover',
                    borderRadius: 2.5,
                    boxShadow: '0 30px 80px rgba(31, 49, 105, .2)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    left: { xs: 16, md: -28 },
                    bottom: { xs: 16, md: 28 },
                    px: 2.5,
                    py: 2,
                    color: 'common.white',
                    bgcolor: 'grey.900',
                    borderRadius: 1.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: 'primary.light' }}>
                    {event.event_type === 'ONLINE' ? 'Online event' : 'Offline event'}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                    {event.location}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: { xs: 300, md: 500 },
                  display: 'grid',
                  placeItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.neutral',
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                }}
              >
                <Box>
                  <Iconify
                    icon="solar:calendar-date-linear"
                    width={44}
                    sx={{ color: 'text.disabled' }}
                  />
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Event baru segera hadir
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
