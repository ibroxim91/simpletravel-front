'use client';

import { useTranslations } from 'next-intl';

import Auth from '@/features/auth/ui/auth';

const RegisterClient = () => {
  const t = useTranslations();
  return (
    <div className="h-full">
      <Auth />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center text-[#212122]">
        <p>{t('2025 © Все права защищены')}</p>
      </div>
    </div>
  );
};

export default RegisterClient;
