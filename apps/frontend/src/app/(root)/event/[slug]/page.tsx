import type { Metadata } from 'next';

import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { getPublicEvent } from 'src/lib/api/events';

import { Iconify } from 'src/components/iconify';

import { getServerSession } from 'src/auth/server';
import {
  listMyRegistrationsAction,
  registerAndCheckoutAction,
  checkoutRegistrationAction,
} from 'src/auth/actions';

// ----------------------------------------------------------------------

function formatIndonesianDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const months = [
    'JANUARI',
    'FEBRUARI',
    'MARET',
    'APRIL',
    'MEI',
    'JUNI',
    'JULI',
    'AGUSTUS',
    'SEPTEMBER',
    'OKTOBER',
    'NOVEMBER',
    'DESEMBER',
  ];
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match && match[1] && match[2] && match[3]) {
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const monthName = months[monthIndex] || '';
    return `${day} ${monthName} ${year}`;
  }
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatIndonesianDateTime(dateStr?: string | null): string {
  if (!dateStr) return '';
  const months = [
    'JANUARI',
    'FEBRUARI',
    'MARET',
    'APRIL',
    'MEI',
    'JUNI',
    'JULI',
    'AGUSTUS',
    'SEPTEMBER',
    'OKTOBER',
    'NOVEMBER',
    'DESEMBER',
  ];
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/);
  if (match && match[1] && match[2] && match[3] && match[4] && match[5]) {
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const hours = match[4];
    const minutes = match[5];
    const monthName = months[monthIndex] || '';
    return `${day} ${monthName} ${year}, ${hours}:${minutes}`;
  }
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${hours}:${minutes}`;
}

function getBenefitIcon(iconOrTitle?: string | null): string {
  if (!iconOrTitle) return 'solar:diploma-verified-bold-duotone';
  const lower = iconOrTitle.toLowerCase();
  if (lower.includes('sertifikat') || lower.includes('cert'))
    return 'solar:diploma-verified-bold-duotone';
  if (lower.includes('snack') || lower.includes('makan') || lower.includes('food'))
    return 'solar:cup-hot-bold-duotone';
  if (lower.includes('merchandise') || lower.includes('kit') || lower.includes('seminar'))
    return 'solar:bag-3-bold-duotone';
  if (lower.includes('skp') || lower.includes('poin') || lower.includes('point'))
    return 'solar:star-bold-duotone';
  if (lower.includes('materi') || lower.includes('modul') || lower.includes('book'))
    return 'solar:book-2-bold-duotone';
  if (lower.includes('relasi') || lower.includes('network'))
    return 'solar:users-group-rounded-outline';
  return 'solar:gift-bold-duotone';
}

// ----------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const event = await getPublicEvent((await params).slug);
  return { title: event?.title ?? 'Event tidak ditemukan', description: event?.description };
}

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, never>>;
}) {
  const slug = (await params).slug;
  await searchParams;
  const error = (await cookies()).get('registration_error')?.value;
  const event = await getPublicEvent(slug);
  if (!event) notFound();
  const session = await getServerSession();
  const registrations = session ? await listMyRegistrationsAction() : null;
  const registration = registrations?.data?.find((item) => item.event_id === event.id);

  const formattedStartDate = formatIndonesianDate(event.start_date);
  const formattedEndDate = event.end_date ? formatIndonesianDate(event.end_date) : '';
  const dateDisplay =
    formattedEndDate && formattedEndDate !== formattedStartDate
      ? `${formattedStartDate} - ${formattedEndDate}`
      : formattedStartDate;

  const timeDisplay = event.end_time
    ? `${event.start_time} - ${event.end_time} WIB`
    : `${event.start_time} WIB`;

  const deadlineDisplay = event.registration_deadline
    ? formatIndonesianDateTime(event.registration_deadline)
    : event.start_date
      ? `${formatIndonesianDate(event.start_date)}, ${event.start_time}`
      : '-';

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        pt: { xs: 10, md: 14 },
        pb: { xs: 6, md: 10 },
      }}
    >
      <Stack spacing={{ xs: 3, md: 4 }}>
        {/* Breadcrumb / Navigation overline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link
            href="/event"
            underline="none"
            sx={{
              typography: 'caption',
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: 'primary.main',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Jelajahi
          </Link>
          <Typography
            variant="caption"
            sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: 1.2 }}
          >
            •
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            Detail Event
          </Typography>
        </Box>

        {/* Hero Banner Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            borderRadius: { xs: 2, md: 3 },
            overflow: 'hidden',
            bgcolor: '#11141A',
            minHeight: { xs: 220, md: 340 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 16px 32px -4px rgba(0, 0, 0, 0.24)',
            backgroundImage: event.banner
              ? `linear-gradient(rgba(17, 20, 26, 0.75), rgba(17, 20, 26, 0.85)), url(${event.banner})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Badge Online/Offline on top left */}
          <Box
            sx={{
              position: 'absolute',
              top: { xs: 14, md: 20 },
              left: { xs: 14, md: 20 },
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.6,
              borderRadius: '16px',
              bgcolor: 'rgba(255, 255, 255, 0.14)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Iconify
              icon={
                event.event_type === 'ONLINE'
                  ? 'solar:videocamera-record-bold'
                  : 'solar:map-point-bold'
              }
              width={14}
            />
            <span>{event.event_type}</span>
          </Box>

          {/* Banner Center Content */}
          <Box sx={{ textAlign: 'center', p: 3, maxWidth: 720 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.light',
                letterSpacing: 2,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                display: 'block',
                mb: 1,
              }}
            >
              SITIVENT • EVENT
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: '#FFFFFF',
                fontWeight: 800,
                lineHeight: 1.15,
                fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.25rem' },
                fontFamily: 'var(--font-barlow, inherit)',
              }}
            >
              {event.title}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert
            severity={
              error === 'registration_closed' || error === 'quota_full' ? 'warning' : 'error'
            }
          >
            {error === 'registration_closed'
              ? 'Pendaftaran event ini sudah ditutup.'
              : error === 'quota_full'
                ? 'Kuota event ini sudah penuh.'
                : error === 'already_registered'
                  ? 'Kamu sudah terdaftar di event ini.'
                  : 'Registrasi gagal. Silakan coba lagi atau hubungi penyelenggara.'}
          </Alert>
        )}

        {/* Main Content (2 Columns Grid) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.85fr 1.15fr' },
            gap: { xs: 4, md: 5 },
            alignItems: 'start',
          }}
        >
          {/* Left Column: Title, Metadata, Description, Benefits, Reviews */}
          <Stack spacing={4}>
            {/* Event Title & Metadata Bar */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2.25rem' },
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-barlow, inherit)',
                }}
              >
                {event.title}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: { xs: 2, md: 3 },
                  mt: 2,
                  color: 'text.secondary',
                  typography: 'caption',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                  <Iconify
                    icon="solar:calendar-date-bold-duotone"
                    width={18}
                    sx={{ color: 'primary.main' }}
                  />
                  <span>{dateDisplay}</span>
                </Box>

                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                  <Iconify
                    icon="solar:clock-circle-outline"
                    width={18}
                    sx={{ color: 'primary.main' }}
                  />
                  <span>{timeDisplay}</span>
                </Box>

                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                  <Iconify
                    icon={
                      event.event_type === 'ONLINE'
                        ? 'solar:videocamera-record-bold-duotone'
                        : 'solar:map-point-bold-duotone'
                    }
                    width={18}
                    sx={{ color: 'primary.main' }}
                  />
                  <span>
                    {event.location || (event.event_type === 'ONLINE' ? 'ZOOM' : 'VENUE')}
                  </span>
                </Box>
              </Box>
            </Box>

            {/* Section: Detail Event */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                Detail Event
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.8,
                  fontSize: { xs: '0.9375rem', md: '1rem' },
                }}
              >
                {event.description}
              </Typography>
            </Box>

            {/* Section: Benefit Event */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                Benefit Event
              </Typography>

              {event.benefits?.length ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: 2,
                  }}
                >
                  {event.benefits.map((benefit) => (
                    <Paper
                      key={benefit.id || benefit.title}
                      variant="outlined"
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 1.5,
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Iconify icon={getBenefitIcon(benefit.icon || benefit.title)} width={24} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {benefit.title}
                        </Typography>
                        {benefit.description ? (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              mt: 0.5,
                              display: 'block',
                              lineHeight: 1.5,
                            }}
                          >
                            {benefit.description}
                          </Typography>
                        ) : null}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    bgcolor: 'background.paper',
                    maxWidth: 400,
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon="solar:diploma-verified-bold-duotone" width={24} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      E-Sertifikat
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', mt: 0.5, display: 'block', lineHeight: 1.5 }}
                    >
                      Dapatkan sertifikat digital resmi setelah menghadiri event.
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Section: Ulasan & Testimoni Peserta */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Ulasan & Testimoni Peserta
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 2.5 }}>
                Ulasan resmi dari peserta yang telah menghadiri event ini.
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 2.5,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: 'background.neutral',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <Iconify
                    icon="solar:chat-round-dots-bold-duotone"
                    width={28}
                    sx={{ color: 'text.disabled' }}
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Belum Ada Ulasan
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 440,
                    mx: 'auto',
                    mt: 0.5,
                    fontSize: '0.8125rem',
                  }}
                >
                  Event ini belum memiliki ulasan dari peserta. Ulasan dapat diberikan oleh peserta
                  yang telah menghadiri event selesai.
                </Typography>
              </Paper>
            </Box>
          </Stack>

          {/* Right Column: Sidebar Registration, Organizer, Speakers */}
          <Stack spacing={3} sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
            {/* Card 1: Biaya Pendaftaran */}
            <Paper
              variant="outlined"
              sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2.5, bgcolor: 'background.paper' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                Biaya Pendaftaran
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  mt: 0.75,
                  mb: 2.5,
                  fontWeight: 800,
                  fontFamily: 'var(--font-barlow, inherit)',
                  color: event.price === 0 ? '#43795b' : 'text.primary',
                }}
              >
                {event.price === 0 ? 'Gratis' : `Rp ${event.price.toLocaleString('id-ID')}`}
              </Typography>

              <Stack
                spacing={1.75}
                sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', mb: 3 }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      typography: 'caption',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    <Iconify icon="solar:users-group-rounded-outline" width={16} />
                    <span>Sisa Kuota</span>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}
                  >
                    {event.quota} Kursi
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      typography: 'caption',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon="solar:clock-circle-outline" width={16} />
                    <span>Batas Pendaftaran</span>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      textAlign: 'right',
                      maxWidth: 180,
                    }}
                  >
                    {deadlineDisplay}
                  </Typography>
                </Box>
              </Stack>

              {session && registration?.status === 'WAITING_PAYMENT' ? (
                <Box component="form" action={checkoutRegistrationAction}>
                  <input type="hidden" name="registration_id" value={registration.id} />
                  <input type="hidden" name="return_to" value={paths.event.details(event.slug)} />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Lanjutkan Pembayaran
                  </Button>
                </Box>
              ) : session && registration && registration.status !== 'CANCELLED' ? (
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  href={paths.participant.dashboard}
                  sx={{ py: 1.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}
                >
                  Sudah Terdaftar · Lihat Tiket
                </Button>
              ) : session ? (
                <Box component="form" action={registerAndCheckoutAction}>
                  <input type="hidden" name="event_id" value={event.id} />
                  <input type="hidden" name="return_to" value={paths.event.details(event.slug)} />
                  <input
                    type="hidden"
                    name="online_attendance"
                    value={event.event_type === 'ONLINE' ? 'true' : 'false'}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Daftar Sekarang
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  href={`${paths.auth.signIn}?returnTo=${encodeURIComponent(paths.event.details(event.slug))}`}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  Masuk Untuk Mendaftar
                </Button>
              )}
            </Paper>

            {/* Card 2: Diselenggarakan Oleh */}
            <Paper
              variant="outlined"
              sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2.5, bgcolor: 'background.paper' }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 1.5,
                }}
              >
                Diselenggarakan Oleh
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Avatar
                  src={event.tenant?.logo_url ?? event.creator?.avatar_url ?? undefined}
                  alt={event.tenant?.name ?? event.creator?.name ?? 'Penyelenggara'}
                  sx={{
                    width: 46,
                    height: 46,
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    border: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0,
                  }}
                >
                  {(event.tenant?.name ?? event.creator?.name ?? 'S').charAt(0)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                    {event.tenant?.name ?? 'Universitas (Rektorat)'}
                  </Typography>

                  {event.tenant?.code ? (
                    <Chip
                      size="small"
                      label={event.tenant.code}
                      color="primary"
                      variant="soft"
                      sx={{ height: 20, fontSize: '0.6875rem', fontWeight: 700, my: 0.5 }}
                    />
                  ) : null}

                  {event.creator?.name ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: 'text.secondary',
                        typography: 'caption',
                        mt: 0.25,
                      }}
                    >
                      <Iconify icon="solar:user-rounded-outline" width={13} />
                      <span>Pembuat: {event.creator.name}</span>
                    </Box>
                  ) : null}

                  {event.tenant?.website ? (
                    <Link
                      href={
                        event.tenant.website.startsWith('http')
                          ? event.tenant.website
                          : `https://${event.tenant.website}`
                      }
                      target="_blank"
                      rel="noopener"
                      variant="caption"
                      color="primary"
                      underline="hover"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.25,
                        mt: 0.5,
                      }}
                    >
                      <span>{event.tenant.website.replace(/^https?:\/\//, '')}</span>
                      <Iconify icon="solar:arrow-right-up-linear" width={11} />
                    </Link>
                  ) : null}
                </Box>
              </Box>
            </Paper>

            {/* Card 3: Pemateri */}
            {event.speakers?.length ? (
              <Paper
                variant="outlined"
                sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 2.5, bgcolor: 'background.paper' }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    letterSpacing: 1.1,
                    textTransform: 'uppercase',
                    display: 'block',
                    mb: 2,
                  }}
                >
                  Pemateri
                </Typography>
                <Stack spacing={2.5}>
                  {event.speakers.map((speaker) => (
                    <Box
                      key={speaker.name || speaker.id}
                      sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
                    >
                      <Avatar
                        src={speaker.avatar ?? undefined}
                        alt={speaker.name}
                        sx={{
                          width: 46,
                          height: 46,
                          bgcolor: 'background.neutral',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {speaker.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {speaker.name}
                        </Typography>
                        {speaker.title && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: 'text.secondary',
                              typography: 'caption',
                              mt: 0.25,
                            }}
                          >
                            <Iconify icon="solar:user-id-bold" width={13} />
                            <span>{speaker.title}</span>
                          </Box>
                        )}
                        {speaker.company && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: 'text.secondary',
                              typography: 'caption',
                              mt: 0.25,
                            }}
                          >
                            <Iconify icon="solar:buildings-bold" width={13} />
                            {speaker.company_url ? (
                              <Link
                                href={speaker.company_url}
                                target="_blank"
                                rel="noopener"
                                color="inherit"
                                underline="hover"
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.25,
                                }}
                              >
                                {speaker.company}
                                <Iconify icon="solar:arrow-right-up-linear" width={11} />
                              </Link>
                            ) : (
                              <span>{speaker.company}</span>
                            )}
                          </Box>
                        )}
                        {speaker.github || speaker.instagram || speaker.linked_in ? (
                          <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {speaker.github && (
                              <Box
                                component="a"
                                href={
                                  speaker.github.startsWith('http')
                                    ? speaker.github
                                    : `https://github.com/${speaker.github}`
                                }
                                target="_blank"
                                rel="noopener"
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  px: 1,
                                  py: 0.25,
                                  height: 22,
                                  borderRadius: '12px',
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  bgcolor: 'background.neutral',
                                  color: 'text.primary',
                                  textDecoration: 'none',
                                  transition: 'background-color 0.2s',
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                  },
                                }}
                              >
                                <Iconify icon="socials:github" width={13} />
                                <span>GitHub</span>
                              </Box>
                            )}
                            {speaker.instagram && (
                              <Box
                                component="a"
                                href={
                                  speaker.instagram.startsWith('http')
                                    ? speaker.instagram
                                    : `https://instagram.com/${speaker.instagram}`
                                }
                                target="_blank"
                                rel="noopener"
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  px: 1,
                                  py: 0.25,
                                  height: 22,
                                  borderRadius: '12px',
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  bgcolor: 'background.neutral',
                                  color: 'text.primary',
                                  textDecoration: 'none',
                                  transition: 'background-color 0.2s',
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                  },
                                }}
                              >
                                <Iconify icon="socials:instagram" width={13} />
                                <span>Instagram</span>
                              </Box>
                            )}
                            {speaker.linked_in && (
                              <Box
                                component="a"
                                href={
                                  speaker.linked_in.startsWith('http')
                                    ? speaker.linked_in
                                    : `https://linkedin.com/in/${speaker.linked_in}`
                                }
                                target="_blank"
                                rel="noopener"
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  px: 1,
                                  py: 0.25,
                                  height: 22,
                                  borderRadius: '12px',
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  bgcolor: 'background.neutral',
                                  color: 'text.primary',
                                  textDecoration: 'none',
                                  transition: 'background-color 0.2s',
                                  '&:hover': {
                                    bgcolor: 'action.hover',
                                  },
                                }}
                              >
                                <Iconify icon="socials:linkedin" width={13} />
                                <span>LinkedIn</span>
                              </Box>
                            )}
                          </Stack>
                        ) : null}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
