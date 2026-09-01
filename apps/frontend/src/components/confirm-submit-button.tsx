'use client';

import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
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
  'aria-label': ariaLabel,
  sx,
  iconOnly = false,
  size = 'medium',
}: {
  children: ReactNode;
  title: string;
  description: string;
  color?: 'primary' | 'error' | 'inherit';
  variant?: 'contained' | 'outlined' | 'text';
  disabled?: boolean;
  'aria-label'?: string;
  sx?: SxProps<Theme>;
  iconOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<HTMLFormElement | null>(null);
  return (
    <>
      {iconOnly ? (
        <IconButton
          type="button"
          color={color}
          size={size}
          disabled={disabled}
          aria-label={ariaLabel}
          sx={sx}
          onClick={(event) => {
            setForm(event.currentTarget.closest('form'));
            setOpen(true);
          }}
        >
          {children}
        </IconButton>
      ) : (
        <Button
          type="button"
          variant={variant}
          color={color}
          disabled={disabled}
          aria-label={ariaLabel}
          sx={sx}
          onClick={(event) => {
            setForm(event.currentTarget.closest('form'));
            setOpen(true);
          }}
        >
          {children}
        </Button>
      )}
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
