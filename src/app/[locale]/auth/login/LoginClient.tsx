'use client';

import { useTranslations } from 'next-intl';

import AuthLogin from '@/features/auth/ui/auth-login';
const LoginClient = () => {
  const t = useTranslations();
  return (
    <div className="h-full">
      <AuthLogin />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center text-[#212122]">
        <p>{t('2025 © Все права защищены')}</p>
      </div>
    </div>
  );
};

export default LoginClient;
