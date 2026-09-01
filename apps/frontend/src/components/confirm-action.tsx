'use client';

import type { ReactNode } from 'react';

import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export function ConfirmAction({
  label,
  title,
  description,
  action,
  color = 'inherit',
  startIcon,
}: {
  label: string;
  title: string;
  description: string;
  action: () => void;
  color?: 'inherit' | 'error';
  startIcon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        color={color}
        onClick={() => setOpen(true)}
        startIcon={startIcon}
        sx={{ justifyContent: 'flex-start', width: 'fit-content' }}
      >
        {label}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button color={color} variant="contained" onClick={action} autoFocus>
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
