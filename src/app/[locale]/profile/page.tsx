'use client';
import ProfileTabs from '@/features/profile/ui/ProfileTabs';
import Welcome from '@/features/profile/ui/welcome';
import { Suspense } from 'react';

const Profile = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <Welcome />
        <ProfileTabs />
      </div>
    </Suspense>
  );
};

export default Profile;
