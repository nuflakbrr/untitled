'use client';

import { type FC } from 'react';
import { Lock, User as UserIcon } from 'lucide-react';

import type { UserSettingsModalProps } from '@/interfaces/features/auth';

import Modal from '@/components/Common/Modals/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useUserSettings } from './_hooks/useUserSettings';
import { ProfileSettingsForm } from './_components/ProfileSettingsForm';
import { SecuritySettingsForm } from './_components/SecuritySettingsForm';

const UserSettingsModal: FC<UserSettingsModalProps> = ({ isOpen, onClose, user }) => {
  const settings = useUserSettings(user, onClose);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Akun"
      description="Kelola informasi pribadi dan pengaturan keamanan akun Anda."
      className="w-full sm:max-w-125"
    >
      <div className="mt-4 w-full">
        <Tabs value={settings.activeTab} onValueChange={settings.setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="size-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="size-4" /> Keamanan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileSettingsForm
              email={user.email}
              name={settings.name}
              pending={settings.isProfilePending}
              onNameChange={settings.setName}
              onSubmit={settings.handleSaveProfile}
              onCancel={onClose}
            />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettingsForm
              currentPassword={settings.currentPassword}
              newPassword={settings.newPassword}
              confirmPassword={settings.confirmPassword}
              pending={settings.isPasswordPending}
              onCurrentPasswordChange={settings.setCurrentPassword}
              onNewPasswordChange={settings.setNewPassword}
              onConfirmPasswordChange={settings.setConfirmPassword}
              onSubmit={settings.handleSavePassword}
              onCancel={onClose}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
};

export default UserSettingsModal;
