'use client';

import AuthLogin from '@/features/auth/ui/auth-login';
import { useTranslations } from 'next-intl';

const Login = () => {
  const t = useTranslations();
  return (
    <div className="h-full max-lg:h-screen">
      <AuthLogin />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center">
        <p>{t('2025 © Все права защищены')}</p>
      </div>
    </div>
  );
};

export default Login;
