'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const AuthForgetPassword = dynamic(
  () => import('@/features/auth/ui/auth-forget-password'),
  { ssr: false },
);

const ForgetPasswordClient = () => {
  const t = useTranslations();
  return (
    <div className="h-full">
      <AuthForgetPassword />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center">
        <p>{t('2025 © Все права защищены')}</p>
      </div>
    </div>
  );
};

export default ForgetPasswordClient;
