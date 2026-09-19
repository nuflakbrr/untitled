'use client';

import type { Html5Qrcode } from 'html5-qrcode';

import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { type FC, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, CameraOff, Smartphone, Flashlight } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { qrTokenSchema, type QrTokenValues } from '@/schemas/attendance';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import { useScanner } from './useScanner';

const ScannerClient: FC = () => {
  const {
    isScanning,
    setIsScanning,
    isSecure,
    isPending,
    isFlashOn,
    onSubmitToken,
    handleManualSubmit,
    handleFileChange,
    handleStartScanning,
    toggleTorch,
  } = useScanner();
  const manualForm = useForm<QrTokenValues>({
    resolver: zodResolver(qrTokenSchema),
    defaultValues: { token: '' },
  });
  const token = manualForm.watch('token');

  // Meminta izin kamera secara reaktif saat button Aktifkan Kamera ditekan.
  // html5-qrcode tidak akan bisa jalan di iOS/Android webview / browser modern jika izin getUserMedia belum di-prompt oleh action user.
  // Karena itu, isScanning diset true HANYA JIKA getUserMedia berhasil.

  // Eruda mobile console debugger
  // useEffect(() => {
  //   const init = async () => {
  //     const eruda = (await import('eruda')).default;
  //     if (!document.getElementById('eruda-container')) {
  //       eruda.init();
  //     }
  //   };
  //   init();
  // }, []);

  useEffect(() => {
    if (!isScanning) return undefined;

    let html5QrCode: Html5Qrcode | undefined;

    import('html5-qrcode')
      .then(({ Html5Qrcode }) => {
        html5QrCode = new Html5Qrcode('qr-reader');

        if (html5QrCode) {
          html5QrCode
            .start(
              { facingMode: 'environment' },
              {
                fps: 10,
                qrbox: { width: 220, height: 220 },
              },
              (decodedText: string) => {
                onSubmitToken(decodedText);
                setIsScanning(false);
              },
              (_error: unknown) => {
                // parsing failures
              }
            )
            .catch((err: unknown) => {
              console.error('Html5Qrcode start error:', err);
              toast.error('Gagal mengakses kamera. Pastikan izin kamera diberikan.');
              setIsScanning(false);
            });
        }
      })
      .catch((err) => {
        console.error('Html5Qrcode load error:', err);
        toast.error('Gagal memuat modul scanner.');
        setIsScanning(false);
      });

    return () => {
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch((err: unknown) => console.error('Failed to stop scanner', err));
        }
      }
    };
  }, [isScanning, onSubmitToken, setIsScanning]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-1">
      {/* Custom Styles for html5-qrcode buttons & scanner widget UI */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }
        .animate-laser {
          animation: scan 2.5s infinite linear;
        }
        /* Override default ugly html5-qrcode UI elements */
        #qr-reader img {
          display: none !important;
        }
        #qr-reader button {
          background-color: var(--eventkan-navy) !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          margin-top: 8px !important;
          cursor: pointer !important;
        }
        #qr-reader select {
          background-color: transparent !important;
          border: 1px solid rgba(128,128,128,0.3) !important;
          padding: 6px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          color: inherit !important;
          margin: 4px 0 !important;
        }
        #qr-reader {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          object-fit: cover !important;
        }
        #qr-reader canvas {
          max-width: 100% !important;
        }
      `}</style>

      {/* Title block */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Scan Kehadiran</h1>
        <p className="mt-1 text-xs text-eventkan-muted">
          Gunakan kamera atau input manual untuk mencatat kehadiran peserta.
        </p>
      </div>

      {/* Scanner Viewport */}
      <div className="group relative mx-auto flex aspect-4/3 w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-eventkan-ink p-0">
        {isScanning ? (
          <div id="qr-reader" className="h-full w-full bg-eventkan-ink" aria-label="Pemindai QR Code" />
        ) : (
          <>
            {isPending ? (
              // Show loading state when API call is pending (during verification)
              <div className="text-center px-4 z-20 space-y-3">
                <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0.5">
                  Memproses QR Code...
                </Badge>
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-eventkan-accent" />
                </div>
                <p className="mx-auto max-w-50 text-[10px] leading-normal text-white/60">
                  Memverifikasi dan memproses presensi peserta...
                </p>
              </div>
            ) : isSecure ? (
              // Original "Camera Disabled" state when not scanning
              <div className="text-center px-4 z-20 space-y-3">
                <Badge variant="destructive" className="text-[10px] uppercase font-bold py-0.5">
                  Kamera Dinonaktifkan
                </Badge>
                <p className="mx-auto max-w-50 text-[10px] leading-normal text-white/60">
                  Aktifkan scanner dengan tombol di bawah.
                </p>
                <Button
                  onClick={handleStartScanning}
                  className="z-20 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-eventkan-accent px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-eventkan-accent-hover"
                >
                  <Camera className="h-4 w-4" /> Aktifkan Kamera
                </Button>
              </div>
            ) : (
              // "Connection Not Secure" state
              <div className="text-center px-4 z-20 space-y-3">
                <Badge variant="destructive" className="text-[10px] uppercase font-bold py-0.5">
                  Koneksi Tidak Aman
                </Badge>
                <p className="mx-auto max-w-50 text-[10px] leading-normal text-white/60">
                  Akses video stream diblokir browser. Ambil foto QR Code menggunakan kamera HP
                  Anda.
                </p>
                <label className="z-20 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-eventkan-accent px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-eventkan-accent-hover">
                  <Camera className="h-4 w-4" /> Foto QR Code
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </>
        )}
      </div>

      {/* Camera Stop button when scanning */}
      {isScanning && (
        <div className="text-center flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsScanning(false)}
            className="text-xs font-semibold px-4 py-2 border-zinc-300 dark:border-zinc-800 hover:bg-muted/50 rounded-xl"
          >
            <CameraOff className="h-4 w-4 mr-2" /> Matikan Kamera
          </Button>
          <Button
            variant="outline"
            onClick={toggleTorch}
            className={`text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
              isFlashOn
                ? 'bg-amber-500/20 text-amber-600 border-amber-300 dark:border-amber-500/30'
                : 'border-zinc-300 dark:border-zinc-800 hover:bg-muted/50'
            }`}
          >
            <Flashlight className="h-4 w-4 mr-2" /> Flash: {isFlashOn ? 'On' : 'Off'}
          </Button>
        </div>
      )}

      {/* Manual Input Form */}
      <Card className="border-none shadow-md bg-white dark:bg-zinc-900 rounded-2xl w-full mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" /> Input Token Manual
          </CardTitle>
          <CardDescription className="text-[11px]">
            Gunakan input di bawah ini jika scanner kamera mengalami kendala.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form
            onSubmit={manualForm.handleSubmit(({ token: value }) => handleManualSubmit(value))}
            className="flex gap-2"
          >
            <Field
              className="min-w-0 flex-1 gap-0"
              data-invalid={!!manualForm.formState.errors.token}
            >
              <FieldLabel htmlFor="qr-token-input" className="sr-only">
                Token QR Code
              </FieldLabel>
              <Input
                id="qr-token-input"
                type="text"
                placeholder="Masukkan token QR Code..."
                value={token}
                {...manualForm.register('token')}
                disabled={isPending}
                className="h-11 rounded-xl text-xs"
              />
              {manualForm.formState.errors.token && (
                <FieldError errors={[manualForm.formState.errors.token]} />
              )}
            </Field>
            <Button
              id="btn-submit-token"
              type="submit"
              disabled={isPending || !token.trim()}
              className="px-4 rounded-xl font-semibold h-11 text-xs shadow-xs"
            >
              {isPending ? 'Mengirim...' : 'Kirim Token'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div id="qr-file-decoder" className="hidden" />
    </div>
  );
};

export default ScannerClient;
