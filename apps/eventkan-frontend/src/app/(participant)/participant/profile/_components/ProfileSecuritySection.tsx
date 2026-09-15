'use client';

import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import AlertModal from '@/components/Common/Modals/AlertModal';

import PasswordField from './PasswordField';
import { useProfileSecurity } from '../_hooks/useProfileSecurity';

export default function ProfileSecuritySection() {
  const security = useProfileSecurity();

  return (
    <>
      <section id="security" className="mt-4.5 rounded-[24px] border border-[#111927]/10 bg-[#fffdf8] p-6.5 shadow-[0_18px_50px_rgba(17,35,63,.08)]">
        <h2 className="font-display text-[22px] font-extrabold tracking-[-.03em] text-[#111927]">Keamanan Akun</h2>
        <p className="mt-1 text-[13px] text-[#6c7280]">Ganti password untuk menjaga keamanan akun.</p>
        <form className="mt-3.5" onSubmit={security.form.handleSubmit(security.submitPasswordChange)}>
          <FieldGroup className="gap-3.5">
            <PasswordField label="Password Saat Ini" name="currentPassword" visible={security.visibility.current} onToggle={() => security.toggleVisibility('current')} form={security.form} placeholder="••••••••" />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <PasswordField label="Password Baru" name="newPassword" visible={security.visibility.next} onToggle={() => security.toggleVisibility('next')} form={security.form} placeholder="Minimal 8 karakter" />
              <PasswordField label="Konfirmasi Password Baru" name="confirmPassword" visible={security.visibility.confirm} onToggle={() => security.toggleVisibility('confirm')} form={security.form} placeholder="Ulangi password baru" />
            </div>
            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={security.isChanging} className="rounded-full bg-[#ff7a45] px-4.5 font-bold text-white hover:bg-[#e86636]">{security.isChanging ? 'Mengubah...' : 'Ganti Password'}</Button>
            </div>
          </FieldGroup>
        </form>
      </section>
      <AlertModal isOpen={security.isModalOpen} onClose={security.closeModal} onConfirm={security.confirmPasswordChange} loading={security.isChanging} title="Konfirmasi Ganti Password" desc="Setelah password berhasil diubah, kamu akan otomatis keluar dari semua sesi dan diarahkan ke halaman login. Notifikasi perubahan password juga akan dikirimkan ke email kamu. Lanjutkan?" />
    </>
  );
}
