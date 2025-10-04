'use client';

import Auth from '@/features/auth/ui/auth';
import { useTranslations } from 'next-intl';

const Ragister = () => {
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

export default Ragister;
