'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const Auth = dynamic(() => import('@/features/auth/ui/auth'), { ssr: false });

const RegisterClient = () => {
  const t = useTranslations();
  return (
    <div className="h-full">
      <Auth />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center">
        <p>{t('2025 © Все права защищены')}</p>
      </div>
    </div>
  );
};

export default RegisterClient;
