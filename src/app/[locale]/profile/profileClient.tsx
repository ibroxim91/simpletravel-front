'use client';
import ProfileTabs from '@/features/profile/ui/ProfileTabs';
import Welcome from '@/features/profile/ui/welcome';
import { getToken } from '@/shared/config/api/saveToke';
import { useRouter } from '@/shared/config/i18n/navigation';
import { Suspense, useEffect } from 'react';

const ProfileClient = () => {
  const router = useRouter();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      router.replace('/auth/register');
    }
  }, [router, token]);

  if (!token) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-10 mb-10 overflow-hidden">
        <Welcome />
        <ProfileTabs />
      </div>
    </Suspense>
  );
};

export default ProfileClient;
