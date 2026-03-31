'use client';

import ProfileTabs from '@/features/profile/ui/ProfileTabs';
import { getToken } from '@/shared/config/api/saveToke';
import { useRouter } from '@/shared/config/i18n/navigation';
import { Suspense, useEffect, useState } from 'react';

const ProfileClient = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    // getToken() faqat clientda ishlasin
    const t = getToken();
    setToken(t);

    // Agar token yo'q bo'lsa, redirect
    if (!t) {
      router.replace('/auth/register');
    }
  }, [router]);

  // Token hali aniqlanmagan bo'lsa (clientda kelyapti)
  if (token === null) {
    return null; // yoki skeleton ko'rsatish mumkin
  }

  // Agar token yo'q bo'lsa, hech narsa render qilmaymiz
  if (!token) return null;

  return (
    <div className="flex flex-col gap-10 mb-10 overflow-hidden">
      <Suspense>
        <ProfileTabs />
      </Suspense>
    </div>
  );
};

export default ProfileClient;
