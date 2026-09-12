'use client';

import type { FC } from 'react';

import type { AlertModal as AlertModalProps } from '@/interfaces/modal';

import { useMounted } from '@/hooks/useMounted';
import { Button } from '@/components/ui/button';
import Modal from '@/components/Common/Modals/Modal';

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  desc,
  variant = 'cms',
}) => {
  const isMounted = useMounted();
  const isPublic = variant === 'public';

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title || 'Apakah Anda yakin?'}
      description={desc || 'Aksi ini tidak akan bisa dibatalkan.'}
      isOpen={isOpen}
      onClose={onClose}
      className={
        isPublic
          ? 'max-w-md rounded-[28px] border border-[#111927]/10 bg-[#fffdf8] p-6 text-[#11233f] shadow-[0_24px_70px_rgba(17,35,63,.16)]'
          : undefined
      }
    >
      {isPublic ? (
        <div className="mt-6 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-full bg-[#11233f] px-5 text-white shadow-[0_8px_18px_rgba(17,35,63,.14)] hover:bg-[#1b3458]"
          >
            {loading ? 'Keluar...' : 'Keluar'}
          </Button>
          <Button
            disabled={loading}
            variant="ghost"
            onClick={onClose}
            className="rounded-full px-5 text-[#6c7280] hover:bg-[#f6f3eb] hover:text-[#11233f]"
          >
            Batalkan
          </Button>
        </div>
      ) : (
        <div className="flex w-full items-center justify-end space-x-2 pt-6">
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>
            Lanjutkan
          </Button>
          <Button disabled={loading} variant="outline" onClick={onClose}>
            Batalkan
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default AlertModal;
