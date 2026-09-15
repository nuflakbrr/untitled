'use client';

import type { FormEvent } from 'react';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import type { UserSettingsModalProps } from '@/interfaces/features/auth';

import { authClient } from '@/lib/authClient';
import {
  updateUserProfile,
  changeParticipantPassword,
} from '@/services/participant/profile';

import { translateAuthError } from '../_libs/translateAuthError.libs';

export function useUserSettings(user: UserSettingsModalProps['user'], onClose: () => void) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return void toast.error('Nama lengkap tidak boleh kosong.');

    startProfileTransition(async () => {
      try {
        const result = await updateUserProfile(name);
        if (!result.success) {
          toast.error(result.error ? translateAuthError(result.error) : 'Gagal memperbarui nama profil.');
          return;
        }
        toast.success('Profil Anda berhasil diperbarui!');
        router.refresh();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error('Terjadi kesalahan jaringan.');
      }
    });
  };

  const handleSavePassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentPassword) return void toast.error('Masukkan kata sandi saat ini.');
    if (newPassword.length < 8) return void toast.error('Kata sandi baru minimal harus 8 karakter.');
    if (newPassword !== confirmPassword) return void toast.error('Konfirmasi kata sandi baru tidak cocok.');

    startPasswordTransition(async () => {
      try {
        const result = await changeParticipantPassword(currentPassword, newPassword);
        if (!result.success) {
          toast.error(result.error ? translateAuthError(result.error) : 'Gagal memperbarui kata sandi.');
          return;
        }

        toast.success('Kata sandi berhasil diperbarui! Silakan login kembali.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await authClient.signOut();
        router.push('/login');
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error('Terjadi kesalahan jaringan.');
      }
    });
  };

  return {
    activeTab,
    confirmPassword,
    currentPassword,
    handleSavePassword,
    handleSaveProfile,
    isPasswordPending,
    isProfilePending,
    name,
    newPassword,
    setActiveTab,
    setConfirmPassword,
    setCurrentPassword,
    setName,
    setNewPassword,
  };
}
