'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

import type { RegisterButtonProps } from '@/interfaces/features/events';

import { Button } from '@/components/ui/button';
import { usePermission } from '@/providers/PermissionProvider';

import RegistrationDialog from './RegistrationDialog';
import { useRegisterEvent } from '../_hooks/useRegisterEvent';
import RegistrationStatusButton from './RegistrationStatusButton';
import { actionButtonClass } from '../_libs/registerButtonStyles';

const RegisterButton: FC<RegisterButtonProps> = ({
  eventId,
  isAuthenticated,
  isEmailVerified,
  isRegistered,
  registrationStatus,
  isDeadlinePassed,
  isQuotaFull,
  price,
  slug,
}) => {
  const { hasRole } = usePermission();
  const isAdminUser = hasRole('superadmin') || hasRole('panitia');
  const { isOpen, isPending, onRegister, setIsOpen } = useRegisterEvent(eventId);

  if (isQuotaFull && !isRegistered) {
    return <RegistrationStatusButton icon={AlertCircle} label="Kuota Penuh" />;
  }

  if (!isAuthenticated) {
    return (
      <Button
        className={`${actionButtonClass} bg-[#11233f] text-white hover:bg-[#1b3458]`}
        asChild
      >
        <Link href={`/login?redirect=/events/${slug}`}>Masuk untuk Mendaftar</Link>
      </Button>
    );
  }

  if (!isEmailVerified) {
    return (
      <Button
        className={`${actionButtonClass} flex items-center justify-center gap-2 bg-[#ffe5d8] text-[#b84a2a] shadow-none hover:bg-[#ffd9c7]`}
        asChild
      >
        <Link href="/participant/dashboard">
          <AlertCircle className="h-4 w-4" /> Verifikasi Email di Dashboard
        </Link>
      </Button>
    );
  }

  if (isRegistered) {
    if (registrationStatus === 'WAITING_PAYMENT') {
      return (
        <div className="space-y-3 w-full">
          <RegistrationStatusButton
            icon={CreditCard}
            label="Menunggu Pembayaran"
            className="border-[#ff7a45]/30 bg-[#ffe5d8] text-[#b84a2a]"
          />
          <Button
            className={`${actionButtonClass} bg-[#11233f] text-white hover:bg-[#1b3458]`}
            asChild
          >
            <Link href="/participant/dashboard">Unggah Bukti di Dashboard</Link>
          </Button>
        </div>
      );
    }

    return (
      <RegistrationStatusButton
        icon={CheckCircle2}
        label="Sudah Terdaftar"
        className="border-[#bfe4c7] bg-[#e5f2e8] text-[#36784b]"
      />
    );
  }

  if (isDeadlinePassed) {
    return <RegistrationStatusButton icon={AlertCircle} label="Batas Pendaftaran Lewat" />;
  }

  if (isAdminUser) {
    return <RegistrationStatusButton icon={AlertCircle} label="Admin Tidak Dapat Mendaftar Event" />;
  }

  return (
    <>
      <Button
        id="btn-register-event"
        onClick={() => setIsOpen(true)}
        className={`${actionButtonClass} transition-all duration-200 hover:scale-[1.02] hover:bg-[#1b3458] active:scale-[0.98] bg-[#11233f] text-white`}
      >
        Daftar Event Sekarang
      </Button>

      <RegistrationDialog
        isOpen={isOpen}
        isPending={isPending}
        onConfirm={() => onRegister()}
        onOpenChange={setIsOpen}
        price={price}
      />
    </>
  );
};

export default RegisterButton;
