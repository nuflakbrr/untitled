'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { use, useState, useEffect } from 'react';
import { Award, Printer, ArrowLeft } from 'lucide-react';

import type {
  CertificateTemplate,
  CertificateVerificationSignature,
} from '@/interfaces/features/certificates';

import { Button } from '@/components/ui/button';
import Loader from '@/components/Common/Loader';
import { formatLongDate } from '@/lib/formatLongDate';
import {
  checkUserIsAdmin,
  getCertificateById,
  updateDownloadTime,
} from '@/services/admin/certificates';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CertificatePage(props: PageProps) {
  const params = use(props.params);
  const [cert, setCert] = useState<Awaited<ReturnType<typeof getCertificateById>>>(null);
  const [template, setTemplate] = useState<CertificateTemplate | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [data, isUserAdmin] = await Promise.all([
          getCertificateById(params.id),
          checkUserIsAdmin(),
        ]);
        setIsAdmin(isUserAdmin);
        if (data) {
          setCert(data);
          await updateDownloadTime(params.id);
        }
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat sertifikat');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#f6f3eb]">
        <Loader />
      </div>
    );
  }

  if (!cert) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#f6f3eb] p-5 text-[#11233f]">
        <section className="w-full max-w-lg rounded-[28px] border border-[#111927]/10 bg-[#fffdf8] p-8 text-center shadow-[0_18px_50px_rgba(17,35,63,.08)]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#ffe5d8] text-[#b84a2a]">
            <Award className="h-7 w-7" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-extrabold tracking-[-.03em]">
            Sertifikat tidak ditemukan
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6c7280]">
            Sertifikat tidak valid atau telah dihapus.
          </p>
          <Button
            className="group mt-6 group rounded-full bg-[#11233f] px-5 text-white hover:bg-[#1b3458]"
            asChild
          >
            <Link href="/participant/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const signatures = cert.signatures ?? [];
  const backgroundUrl = template?.backgroundUrl ?? null;
  const showIssuedDate = template?.showIssuedDate ?? true;
  const titleFont = template?.titleFont ?? 'Inter';
  const titleColor = template?.titleColor ?? '#11233f';
  const contentFont = template?.contentFont ?? 'Inter';
  const contentColor = template?.contentColor ?? '#4b5565';
  const primaryColor = template?.primaryColor ?? '#ff7a45';
  const showEventDate = template?.showEventDate ?? true;
  const showEventLocation = template?.showEventLocation ?? false;
  const headerText = template?.headerText ?? 'EVENTKAN';
  const headerSubtitle = template?.headerSubtitle ?? 'Sertifikat Partisipasi Resmi';
  const headerFont = template?.headerFont ?? 'Inter';
  const headerColor = template?.headerColor ?? '#11233f';
  const showHeader = template?.showHeader ?? true;
  const footerMarginBottom = template?.footerMarginBottom ?? 0;

  return (
    <main className="min-h-dvh bg-[#f6f3eb] px-4 py-6 sm:px-7 sm:py-10 print:bg-white print:p-0">
      {/* Action Bar (Hidden on Print) */}
      <div className="no-print mx-auto mb-5 flex w-full max-w-5xl items-center justify-between gap-3 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-4 text-[#11233f] hover:bg-[#fffdf8]"
          asChild
        >
          <Link
            href={isAdmin ? '/admin/master/certificates' : '/participant/dashboard'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePrint}
            size="sm"
            className="flex items-center gap-2 rounded-full bg-[#11233f] px-4 text-white hover:bg-[#1b3458]"
          >
            <Printer className="h-4 w-4" /> Cetak / Simpan PDF
          </Button>
        </div>
      </div>

      {/* Certificate Container */}
      <div
        id="certificate-container"
        className="relative mx-auto flex aspect-[1.414/1] w-full max-w-5xl flex-col items-center justify-between overflow-hidden rounded-[28px] border border-[#111927]/10 bg-[#fffdf8] text-[#11233f] shadow-[0_24px_70px_rgba(17,35,63,.1)] print:m-0 print:h-full print:w-full print:aspect-auto print:rounded-none print:shadow-none"
        style={
          !backgroundUrl
            ? {
                padding: 'clamp(1.5rem, 5vw, 4rem)',
                color: contentColor,
                fontFamily: contentFont,
              }
            : {
                padding: 'clamp(1.5rem, 5vw, 4rem)',
                color: contentColor,
                fontFamily: contentFont,
              }
        }
      >
        {/* ── Custom Background ── */}
        {backgroundUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundUrl}
              alt="certificate background"
              className="w-full h-full object-fill"
            />
          </div>
        )}

        {/* ── Decorative (only if no background) ── */}
        {!backgroundUrl && (
          <>
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#ff7a45]/12" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#f7df86]/35" />
          </>
        )}

        {/* All content sits above background */}
        <div className="relative z-10 w-full flex flex-col justify-between items-center h-full">
          {/* Top Header */}
          <div
            className="flex w-full flex-col items-center space-y-2 text-center"
            style={{ visibility: showHeader ? 'visible' : 'hidden' }}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#11233f] text-white">
                <Award className="h-5 w-5" style={{ color: primaryColor }} />
              </span>
              <span
                className="font-display text-2xl font-extrabold tracking-[-.04em] uppercase"
                style={{ color: headerColor, fontFamily: headerFont }}
              >
                {headerText}
              </span>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[.16em] text-[#6c7280]"
              style={{ color: headerColor }}
            >
              {headerSubtitle}
            </span>
            <div
              className="mx-auto mt-2 h-1 w-16 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
          </div>

          {/* Main Content */}
          <div className="my-6 flex w-full flex-col items-center space-y-5 text-center">
            <h2
              className="font-display text-3xl font-extrabold uppercase tracking-[-.04em] sm:text-5xl"
              style={{ fontFamily: titleFont, color: titleColor }}
            >
              SERTIFIKAT
            </h2>
            <span className="text-sm font-medium text-[#6c7280]">
              Dengan bangga diberikan kepada:
            </span>
            <div className="space-y-1">
              <h1
                className="font-display inline-block border-b-2 px-6 pb-2 text-2xl font-extrabold tracking-[-.04em] capitalize sm:text-4xl"
                style={{
                  fontFamily: titleFont,
                  color: titleColor,
                  borderColor: `${contentColor}33`,
                }}
              >
                {cert.participantName || cert.participantEmail || 'Peserta Event'}
              </h1>
              <p className="mt-1 text-xs tracking-[.04em] text-[#6c7280]">
                No. Sertifikat: {cert.certificateNumber}
              </p>
            </div>
            <p className="text-sm max-w-xl mx-auto leading-relaxed">
              Atas partisipasi aktif sebagai peserta dalam{' '}
              <strong className="font-semibold" style={{ color: titleColor }}>
                {cert.eventTitle}
              </strong>{' '}
              yang diselenggarakan
              {showEventDate && (
                <>
                  {' '}
                  pada tanggal{' '}
                  <strong className="font-semibold" style={{ color: titleColor }}>
                    {formatLongDate(cert.eventDate)}
                  </strong>
                </>
              )}
              {showEventLocation && (
                <>
                  {' '}
                  di{' '}
                  <strong className="font-semibold" style={{ color: titleColor }}>
                    {cert.eventLocation}
                  </strong>
                </>
              )}
              .
            </p>
          </div>

          {/* Footer Area — Signatures */}
          <div
            className="w-full border-t pt-4"
            style={{ borderColor: `${contentColor}1a`, marginBottom: `${footerMarginBottom}px` }}
          >
            {signatures.length > 0 ? (
              <div className="flex items-end justify-center gap-12 flex-wrap">
                {/* Issue date on the left — conditional */}
                {showIssuedDate && (
                  <div className="text-left space-y-1">
                    <p className="text-[11px] font-semibold">TANGGAL TERBIT</p>
                    <p className="text-xs font-bold" style={{ color: titleColor }}>
                      {formatLongDate(cert.issuedAt)}
                    </p>
                  </div>
                )}

                {/* Render each signature */}
                {signatures.map((sig: CertificateVerificationSignature) => (
                  <div key={sig.id} className="flex flex-col items-center space-y-1">
                    <div className="h-20 w-36 relative flex items-center justify-center">
                      <img
                        src={sig.signatureUrl}
                        alt={sig.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div
                      className="border-t pt-1 px-3 text-center"
                      style={{ borderColor: `${contentColor}33` }}
                    >
                      <p
                        className="text-xs font-bold uppercase font-mono tracking-wide"
                        style={{ color: titleColor }}
                      >
                        {sig.name}
                      </p>
                      {sig.title && <p className="text-[10px] font-mono">{sig.title}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback if no signatures configured */
              <div className="flex justify-between items-end">
                <div className="text-left space-y-1">
                  <p className="text-[11px] font-semibold">TANGGAL TERBIT</p>
                  <p className="text-xs font-bold" style={{ color: titleColor }}>
                    {formatLongDate(cert.issuedAt)}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-14 w-32 relative flex items-center justify-center">
                    <span
                      className="font-serif italic text-sm"
                      style={{ color: `${contentColor}66` }}
                    >
                      EVENTKAN System
                    </span>
                  </div>
                  <p
                    className="text-xs font-bold uppercase font-mono tracking-wider border-t pt-1 px-4"
                    style={{ borderColor: `${contentColor}33` }}
                  >
                    Panitia Penyelenggara
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          * {
            box-sizing: border-box !important;
          }
          html,
          body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden !important;
            font-size: 19px !important;
          }
          .no-print {
            display: none !important;
          }
          #certificate-container {
            width: 100vw !important;
            height: 70.72vw !important;
            max-height: 100vh !important;
            max-width: 141.42vh !important;
            margin: auto !important;
            padding: 3rem 4rem 5rem 4rem !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            position: absolute !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </main>
  );
}
