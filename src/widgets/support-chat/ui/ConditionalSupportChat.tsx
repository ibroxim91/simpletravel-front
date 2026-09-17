'use client';

import SupportChatWidget from '@/widgets/support-chat/ui/SupportChatWidget';
import { usePathname } from 'next/navigation';

/** Locale-li path: /uz/selectour yoki /ru/selectour — lekin /selectour/123 emas */
function isSelectourListPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /\/selectour\/?$/.test(pathname);
}

/** /uz/selectour/123 — tour detail page */
function isTourDetailPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /\/selectour\/[^/]+/.test(pathname) && !/\/selectour\/?$/.test(pathname);
}

export default function ConditionalSupportChat() {
  const pathname = usePathname();

  if (isSelectourListPath(pathname)) return null;

  const fabClassName = isTourDetailPath(pathname)
    ? 'bottom-[calc(0.85rem+env(safe-area-inset-bottom,0px))] max-md:bottom-[calc(0.85rem+env(safe-area-inset-bottom,0px))]'
    : undefined;

  return <SupportChatWidget variant="fab" fabClassName={fabClassName} />;
}
