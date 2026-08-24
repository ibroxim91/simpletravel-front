'use client';

import { trackPageView } from '@/shared/lib/analytics';
import { usePathname } from '@/shared/config/i18n/navigation';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AnalyticsPageTracker() {
  const pathname = usePathname();
  const { locale } = useParams();

  useEffect(() => {
    if (!pathname) return;
    trackPageView(pathname, String(locale || 'uz'));
  }, [pathname, locale]);

  return null;
}
