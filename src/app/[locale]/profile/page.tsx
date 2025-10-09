'use client';
import { getToken } from '@/shared/config/api/saveToke';
import { useRouter } from '@/shared/config/i18n/navigation';
import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
const ProfileTabs = dynamic(() => import('@/features/profile/ui/ProfileTabs'), {
  ssr: false,
});
const Welcome = dynamic(() => import('@/features/profile/ui/welcome'), {
  ssr: false,
});

const Profile = () => {
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

export default Profile;
