'use client';

import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { type FC, useState, useEffect } from 'react';
import { QrCode, Smartphone, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

type Props = {
  qrToken: string;
  eventTitle: string;
  registrationNumber?: string;
  disabled?: boolean;
};

const ShowQrButton: FC<Props> = ({ qrToken, eventTitle, registrationNumber, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (qrToken) {
      QRCode.toDataURL(qrToken, { width: 300, margin: 1 })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [qrToken]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          id="btn-show-qr"
          disabled={disabled}
          className="w-full cursor-pointer disabled:cursor-not-allowed"
          style={{
            background: disabled ? '#E3DACC' : '#788C5D',
            color: disabled ? '#87867F' : '#ffffff',
            borderColor: 'transparent',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {disabled ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Hadir Terkonfirmasi
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Tampilkan QR Code Presensi
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-6 text-center">
        <DialogHeader className="pr-6 pt-1">
          <DialogTitle className="text-center font-extrabold text-base sm:text-lg leading-snug wrap-break-word pr-2">
            {eventTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            QR Code Kehadiran Peserta
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          <div className="bg-white p-3 rounded-2xl border shadow-xs flex items-center justify-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code Presensi"
                className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
              />
            ) : (
              <div className="w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center text-xs text-muted-foreground">
                Memuat QR...
              </div>
            )}
          </div>
          <div className="space-y-1">
            {registrationNumber && (
              <p className="font-mono text-xs text-muted-foreground font-semibold">
                No: {registrationNumber}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground font-mono break-all max-w-50">
              Token: {qrToken}
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3 text-left">
          <Smartphone className="h-5 w-5 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-snug">
            Tunjukkan layar ini kepada petugas/panitia di gerbang masuk event untuk dipindai.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowQrButton;
