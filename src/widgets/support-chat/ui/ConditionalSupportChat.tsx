'use client';

import SupportChatWidget from '@/widgets/support-chat/ui/SupportChatWidget';
import { usePathname } from 'next/navigation';

export default function ConditionalSupportChat() {
  const pathname = usePathname();
  const isSelectourList = /\/selectour\/?$/.test(pathname || '');

  if (isSelectourList) return null;

  return <SupportChatWidget variant="fab" />;
}
