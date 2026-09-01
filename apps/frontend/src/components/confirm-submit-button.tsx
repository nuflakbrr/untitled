'use client';

import type { ReactNode } from 'react';

import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

export function ConfirmSubmitButton({
  children,
  title,
  description,
  color = 'primary',
  variant = 'contained',
  disabled,
}: {
  children: ReactNode;
  title: string;
  description: string;
  color?: 'primary' | 'error' | 'inherit';
  variant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<HTMLFormElement | null>(null);
  return (
    <>
      <Button
        type="button"
        variant={variant}
        color={color}
        disabled={disabled}
        onClick={(event) => {
          setForm(event.currentTarget.closest('form'));
          setOpen(true);
        }}
      >
        {children}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button
            variant="contained"
            color={color}
            autoFocus
            onClick={() => {
              setOpen(false);
              form?.requestSubmit();
            }}
          >
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
