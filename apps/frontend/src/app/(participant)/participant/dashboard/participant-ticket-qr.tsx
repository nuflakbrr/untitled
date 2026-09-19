'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { submitAttendanceProofAction } from 'src/auth/actions';

type ParticipantTicketQRProps = {
  eventTitle: string;
  registrationID: string;
  qrToken: string;
  eventID: string;
  registrationNumber: string;
  attendanceStatus: string;
  attendanceProofStatus: string;
  eventType: string;
  eventLocation: string;
};

export function ParticipantTicketQR({
  eventTitle,
  registrationID,
  qrToken,
  eventID,
  registrationNumber,
  attendanceStatus,
  attendanceProofStatus,
  eventType,
  eventLocation,
}: ParticipantTicketQRProps) {
  const [open, setOpen] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);
  const [proofState, proofAction, actionPending] = useActionState(submitAttendanceProofAction, {
    error: '',
  });
  const checkedIn = attendanceStatus === 'HADIR';
  const isOnline = eventType.toUpperCase() === 'ONLINE';
  const proofPending = attendanceProofStatus === 'PENDING';

  return (
    <>
      {isOnline ? (
        <Button variant="contained" onClick={() => setProofOpen(true)}>
          {checkedIn || proofPending ? 'Kehadiran sedang diproses' : 'Masuk ke Ruang Meeting Event'}
        </Button>
      ) : (
        <Button variant="contained" onClick={() => setOpen(true)} disabled={checkedIn}>
          {checkedIn ? 'Sudah check-in' : 'Tampilkan QR code'}
        </Button>
      )}
      {!isOnline ? (
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>QR tiket event</DialogTitle>
          <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
            <Typography variant="h6">{eventTitle}</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
              Tunjukkan QR code ini saat check-in.
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                mt: 3,
                bgcolor: 'common.white',
                borderRadius: 2,
              }}
            >
              <QRCodeSVG value={`${eventID}|${qrToken}`} size={220} level="M" includeMargin />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              {registrationNumber}
            </Typography>
          </DialogContent>
        </Dialog>
      ) : null}
      {isOnline ? (
        <Dialog open={proofOpen} onClose={() => setProofOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Konfirmasi kehadiran online</DialogTitle>
          <DialogContent>
            {proofState.error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {proofState.error}
              </Alert>
            ) : null}
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Buka ruang meeting, ikuti acara, lalu kirim tautan screenshot sebagai bukti. Panitia
              akan memvalidasinya secara manual.
            </Typography>
            <Button
              component="a"
              href={eventLocation}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{ mb: 2 }}
            >
              Buka ruang meeting
            </Button>
            <Box
              component="form"
              action={proofAction}
              onSubmit={() => setProofOpen(false)}
              sx={{ display: 'grid', gap: 2 }}
            >
              <input type="hidden" name="registration_id" value={registrationID} />
              <TextField
                name="proof_url"
                label="Link screenshot bukti kehadiran"
                type="url"
                required
                fullWidth
              />
              <Button type="submit" variant="contained" disabled={actionPending}>
                {actionPending ? 'Mengirim...' : 'Kirim bukti kehadiran'}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
