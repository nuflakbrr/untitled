import type { Metadata } from 'next';

import { redirect } from 'next/navigation';

import { verifyPermission } from '@/services/admin/security';

import ScannerClient from './_components/ScannerClient';

export const metadata: Metadata = {
  title: 'Scan Presensi - EVENTKAN',
  description: 'Pindai QR Code peserta untuk mencatat kehadiran secara cepat.',
};

export const dynamic = 'force-dynamic';

export default async function ScanPage({ params }: { params: Promise<{ tenant_id: string }> }) {
  const { tenant_id: tenantId } = await params;
  const hasScanPermission = await verifyPermission('attendance.scan');
  if (!hasScanPermission) {
    return redirect(`/admin/${tenantId}/dashboard`);
  }

  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 max-w-4xl">
      <ScannerClient />
    </div>
  );
}
