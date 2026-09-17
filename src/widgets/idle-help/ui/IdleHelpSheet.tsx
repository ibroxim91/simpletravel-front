'use client';

import onlyNumber from '@/shared/lib/onlyNember';
import { getContact } from '@/widgets/footer/lib/api';
import { useIdleHelpPrompt } from '@/widgets/idle-help/lib/useIdleHelpPrompt';
import CallIcon from '@mui/icons-material/Call';
import CloseIcon from '@mui/icons-material/Close';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function IdleHelpSheet() {
  const t = useTranslations();
  const { open, dismiss } = useIdleHelpPrompt(true);
  const [mounted, setMounted] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (bubbleRef.current?.contains(target)) return;
      dismiss();
    };

    // Defer so the opening click/touch does not immediately close
    const timer = window.setTimeout(() => {
      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('touchstart', onPointerDown, { passive: true });
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open, dismiss]);

  const { data: contact } = useQuery({
    queryKey: ['get_contact'],
    queryFn: () => getContact(),
    select(data) {
      return data.data.data.results?.[0];
    },
    enabled: open,
  });

  const telegramHref = contact?.telegram_chat || contact?.telegram || '';
  const phoneRaw = contact?.main_phone || contact?.other_phone || '';
  const phoneHref = phoneRaw ? `tel:${onlyNumber(phoneRaw)}` : '';

  if (!mounted || !open) return null;

  return createPortal(
    <div
      ref={bubbleRef}
      className="fixed right-5 z-[85] w-[min(100vw-2rem,320px)] max-md:right-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] max-md:bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      role="dialog"
      aria-labelledby="idle-help-title"
    >
      <div className="relative rounded-2xl bg-white p-4 shadow-[0_8px_32px_rgba(17,34,17,0.14)]">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F4F6] text-[#6B7280] transition hover:bg-[#E5E7EB]"
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </button>

        <div className="mb-2 flex items-center gap-2 pr-8">
          <span className="text-[22px] leading-none" aria-hidden>
            👋
          </span>
          <h2 id="idle-help-title" className="text-[17px] font-bold leading-6 text-[#1C1C1E]">
            {t('idle_help_title')}
          </h2>
        </div>

        <p className="mb-4 text-[13px] font-medium leading-5 text-[#6B7280]">
          {t('idle_help_body')}
        </p>

        <div className="flex flex-col gap-2.5">
          {phoneHref ? (
            <a
              href={phoneHref}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1A73E8] text-[14px] font-semibold text-white transition hover:bg-[#1557B0]"
            >
              <CallIcon sx={{ fontSize: 18 }} />
              {t('idle_help_call')}
            </a>
          ) : null}

          {telegramHref ? (
            <a
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E8F1FF] text-[14px] font-semibold text-[#1A73E8] transition hover:bg-[#D6E6FF]"
            >
              <TelegramIcon sx={{ fontSize: 18 }} />
              {t('idle_help_telegram')}
            </a>
          ) : null}
        </div>

        <span
          aria-hidden
          className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 bg-white shadow-[2px_2px_4px_rgba(17,34,17,0.06)]"
        />
      </div>
    </div>,
    document.body,
  );
}
