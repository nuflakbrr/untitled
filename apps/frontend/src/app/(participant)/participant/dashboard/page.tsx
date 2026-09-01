import { cookies } from 'next/headers';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { listMyReviewsAction, listMyRegistrationsAction } from 'src/auth/actions';

import { ReviewForm } from './review-form';
import { ParticipantTicketQR } from './participant-ticket-qr';

const statusLabels: Record<string, string> = {
  REGISTERED: 'Terdaftar',
  CHECKED_IN: 'Hadir',
  CANCELLED: 'Dibatalkan',
  PRESENT: 'Hadir',
  ABSENT: 'Belum hadir',
  ISSUED: 'Sudah terbit',
  PENDING: 'Menunggu',
};

const getStatusLabel = (status: string) =>
  (statusLabels[status] ?? status.replaceAll('_', ' ')).toUpperCase();

export default async function ParticipantDashboardPage() {
  const [result, reviewsResult] = await Promise.all([
    listMyRegistrationsAction(),
    listMyReviewsAction(),
  ]);
  const checkoutError = (await cookies()).get('registration_error')?.value === 'checkout';
  const registrations = result.data ?? [];
  const reviewed = new Set((reviewsResult.data ?? []).map((review) => review.registration_id));
  const activeCount = registrations.filter((item) => item.status !== 'CANCELLED').length;
  const releasedTickets = registrations
    .filter((item) => ['REGISTERED', 'CHECKED_IN'].includes(item.status))
    .sort(
      (first, second) =>
        new Date(first.event_start_date).getTime() - new Date(second.event_start_date).getTime()
    )
    .slice(0, 1);

  return (
    <Stack
      spacing={{ xs: 3, md: 4 }}
      sx={{ maxWidth: 1220, mx: 'auto', py: { xs: 3, md: 6 }, px: { xs: 2, md: 3 } }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          color: 'common.white',
          bgcolor: 'grey.900',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 650 }}>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>
            Ruang peserta
          </Typography>
          <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
            Event yang kamu ikuti.
          </Typography>
          <Typography sx={{ mt: 1.5, color: 'grey.400', maxWidth: 540 }}>
            Simpan tiket, pantau status registrasi, dan temukan pengalaman berikutnya.
          </Typography>
          <Button component="a" href={paths.event.root} variant="contained" sx={{ mt: 3 }}>
            Jelajahi event
          </Button>
        </Box>
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            width: 260,
            height: 260,
            right: -70,
            bottom: -150,
            border: '52px solid',
            borderColor: 'primary.main',
            borderRadius: '50%',
            opacity: 0.55,
          }}
        />
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {[
          ['Total registrasi', registrations.length],
          ['Event aktif', activeCount],
          ['Sertifikat', 0],
        ].map(([label, value]) => (
          <Paper key={label} variant="outlined" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 2 }}>
            <Typography variant="h3">{value}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: { xs: '1fr', md: releasedTickets.length ? '4fr 8fr' : '1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {releasedTickets.length ? (
          <Box
            sx={{
              position: { xs: 'static', md: 'sticky' },
              top: { md: 88 },
              zIndex: { md: 2 },
            }}
          >
            <Typography variant="overline" color="primary.main">
              Tiket siap digunakan
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {releasedTickets.map((ticket) => (
                <Paper key={ticket.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Stack spacing={1.5}>
                    <Box
                      component="img"
                      src={
                        ticket.event_banner || '/assets/illustrations/illustration-dashboard.webp'
                      }
                      alt={`Banner ${ticket.event_title}`}
                      sx={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                        borderRadius: 1.5,
                      }}
                    />
                    <Typography variant="h6">{ticket.event_title}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}
                    >
                      <Iconify icon="solar:calendar-date-linear" width={16} />
                      {new Date(ticket.event_start_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Typography>
                    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}
                      >
                        <Iconify icon="solar:map-point-bold" width={16} />
                        {ticket.event_location || 'Lokasi belum ditentukan'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}
                      >
                        <Iconify icon="solar:monitor-smartphone-outline" width={16} />
                        {ticket.event_type}
                      </Typography>
                    </Stack>
                    <ParticipantTicketQR
                      eventTitle={ticket.event_title}
                      qrToken={ticket.qr_token}
                      eventID={ticket.event_id}
                      registrationNumber={ticket.registration_number}
                      attendanceStatus={ticket.attendance_status}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        ) : null}
        <Stack
          spacing={3}
          sx={{ gridColumn: { xs: 'auto', md: releasedTickets.length ? '2' : '1' }, minWidth: 0 }}
        >
          <Box>
            <Typography variant="h4">Registrasi terbaru</Typography>
          </Box>
          {checkoutError ? (
            <Alert severity="error">
              Registrasi berhasil, tetapi halaman pembayaran iPaymu belum dapat dibuka. Silakan coba
              lagi dari event tersebut atau hubungi penyelenggara.
            </Alert>
          ) : null}
          {result.error ? <Alert severity="error">{result.error}</Alert> : null}
          {!result.error && !registrations.length ? (
            <Paper
              variant="outlined"
              sx={{ p: { xs: 3, md: 5 }, borderRadius: 2, textAlign: 'center' }}
            >
              <Typography variant="h5">Belum ada event di sini</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Jelajahi event publik untuk mulai berpartisipasi.
              </Typography>
              <Button component="a" href={paths.event.root} variant="outlined" sx={{ mt: 3 }}>
                Lihat katalog event
              </Button>
            </Paper>
          ) : null}
          {registrations.length ? (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ width: '100%', minWidth: 0, overflowX: 'auto', borderRadius: 2 }}
            >
              <Table
                sx={{
                  width: '100%',
                  minWidth: 1100,
                  tableLayout: 'auto',
                  '& .MuiTableCell-root': {
                    px: { xs: 1, md: 2 },
                    whiteSpace: 'nowrap',
                  },
                  '& .MuiTableCell-root:nth-of-type(1)': { minWidth: 240 },
                  '& .MuiTableCell-root:nth-of-type(2)': { minWidth: 130 },
                  '& .MuiTableCell-root:nth-of-type(3)': { minWidth: 220 },
                  '& .MuiTableCell-root:nth-of-type(4)': { minWidth: 110 },
                  '& .MuiTableCell-root:nth-of-type(5)': { minWidth: 140 },
                  '& .MuiTableCell-root:nth-of-type(6)': { minWidth: 160 },
                  '& .MuiTableCell-root:nth-of-type(7)': { minWidth: 260 },
                }}
              >
                <TableHead>
                  <TableRow>
                    {[
                      'Event',
                      'Tanggal',
                      'Lokasi',
                      'Tipe',
                      'Kehadiran',
                      'Sertifikat',
                      'Review',
                    ].map((heading) => (
                      <TableCell key={heading}>{heading}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id} hover>
                      <TableCell>
                        <Button
                          href={paths.event.details(registration.event_slug)}
                          sx={{ p: 0, justifyContent: 'flex-start', textAlign: 'left' }}
                        >
                          {registration.event_title}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {new Date(registration.event_start_date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>{registration.event_location || '-'}</TableCell>
                      <TableCell>{registration.event_type}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(registration.attendance_status)}
                          size="small"
                          color={
                            registration.attendance_status === 'HADIR'
                              ? 'success'
                              : registration.attendance_status === 'BELUM HADIR'
                                ? 'warning'
                                : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(registration.certificate_status)}
                          size="small"
                          color={
                            registration.certificate_status === 'TERBIT'
                              ? 'success'
                              : registration.certificate_status === 'MENUNGGU TERBIT'
                                ? 'warning'
                                : registration.certificate_status === 'TIDAK TERSEDIA'
                                  ? 'error'
                                  : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {registration.event_status === 'COMPLETED' &&
                        registration.status === 'CHECKED_IN' &&
                        !reviewed.has(registration.id) ? (
                          <ReviewForm registrationID={registration.id} />
                        ) : reviewed.has(registration.id) ? (
                          'Sudah diulas'
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </Stack>
      </Box>
    </Stack>
  );
}
