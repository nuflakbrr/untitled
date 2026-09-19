'use client';

import type { ParticipantProfileFormProps } from '@/interfaces/features/profile';

import ProfileSidebar from './ProfileSidebar';
import ProfileSecuritySection from './ProfileSecuritySection';
import ProfileInformationSection from './ProfileInformationSection';
import ProfileDeactivationSection from './ProfileDeactivationSection';

export default function ProfileForm({ user }: ParticipantProfileFormProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      <ProfileSidebar user={user} />
      <div className="min-w-0">
        <ProfileInformationSection user={user} />
        <ProfileSecuritySection />
        <ProfileDeactivationSection />
      </div>
    </div>
  );
}
