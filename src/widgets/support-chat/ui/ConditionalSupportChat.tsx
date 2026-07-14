'use client';

import SupportChatWidget from '@/widgets/support-chat/ui/SupportChatWidget';
import { usePathname } from 'next/navigation';

/** Locale-li path: /uz/selectour yoki /ru/selectour — lekin /selectour/123 emas */
function isSelectourListPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /\/selectour\/?$/.test(pathname);
}

export default function ConditionalSupportChat() {
  const pathname = usePathname();

  if (isSelectourListPath(pathname)) return null;

  return <SupportChatWidget variant="fab" />;
}
