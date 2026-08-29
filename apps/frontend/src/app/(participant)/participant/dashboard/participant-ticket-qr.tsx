'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

type ParticipantTicketQRProps = {
  eventTitle: string;
  qrToken: string;
  registrationNumber: string;
};

export function ParticipantTicketQR({
  eventTitle,
  qrToken,
  registrationNumber,
}: ParticipantTicketQRProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Tampilkan QR code
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>QR tiket event</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          <Typography variant="h6">{eventTitle}</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            Tunjukkan QR code ini saat check-in.
          </Typography>
          <Box
            sx={{ display: 'inline-flex', p: 2, mt: 3, bgcolor: 'common.white', borderRadius: 2 }}
          >
            <QRCodeSVG value={qrToken} size={220} level="M" includeMargin />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            {registrationNumber}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
