'use client';

import { usePathname } from '@/shared/config/i18n/navigation';
import Footer from '@/widgets/footer/ui';

const authRoutes = [
  '/auth',
  '/auth/register',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

export default function ConditionalFooter() {
  const pathname = usePathname();

  if (authRoutes.includes(pathname)) {
    return null;
  }

  return <Footer />;
}
