'use client';

import { Button } from '@/components/ui/button';
import AlertModal from '@/components/Common/Modals/AlertModal';

import { useProfileDeactivation } from '../_hooks/useProfileDeactivation';

export default function ProfileDeactivationSection() {
  const deactivation = useProfileDeactivation();

  return (
    <>
      <section id="deactivate" className="mt-4.5 rounded-[24px] border border-eventkan-peach-ink/20 bg-[#fff5ef] p-6.5 shadow-[0_18px_50px_rgba(17,35,63,.05)]">
        <h2 className="font-display text-[22px] font-extrabold tracking-[-.03em] text-eventkan-navy">Tangguhkan Akun</h2>
        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-eventkan-muted">Akun akan dinonaktifkan dan kamu akan keluar dari sesi saat ini. Data event dan sertifikat tetap tersimpan.</p>
        <div className="mt-4 flex justify-end">
          <Button type="button" variant="outline" disabled={deactivation.isDeactivating} onClick={deactivation.openModal} className="rounded-full border-eventkan-peach-ink/30 px-4.5 font-bold text-eventkan-peach-ink hover:bg-eventkan-peach hover:text-eventkan-peach-ink">Tangguhkan Akun</Button>
        </div>
      </section>
      <AlertModal isOpen={deactivation.isModalOpen} onClose={deactivation.closeModal} onConfirm={deactivation.deactivateAccount} loading={deactivation.isDeactivating} title="Tangguhkan akun?" desc="Akunmu akan dinonaktifkan dan kamu bisa mengaktifkannya kembali melalui tautan email. Lanjutkan?" />
    </>
  );
}
