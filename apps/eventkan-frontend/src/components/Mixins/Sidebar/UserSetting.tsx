'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { signOut } from '@/lib/authClient';
import AlertModal from '@/components/Common/Modals/AlertModal';

import UserSettingsModal from './UserSettingsModal';
import { SidebarUserMenu } from './_components/SidebarUserMenu';

type User = { name: string; email: string; avatar: string };

export function UserSetting({ user }: { user: User }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await signOut();
      if (error) throw new Error('Gagal keluar dari sistem.');
    },
    onSuccess: () => {
      toast.success('Berhasil keluar. Sampai jumpa!');
      window.location.href = '/login';
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <SidebarUserMenu
        user={user}
        onSettings={() => setSettingsOpen(true)}
        onLogout={() => setLogoutOpen(true)}
      />
      <UserSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} user={user} />
      <AlertModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => logout()}
        loading={isPending}
        title="Keluar dari Sistem"
        desc="Apakah Anda yakin ingin keluar dari akun Anda?"
      />
    </>
  );
}
