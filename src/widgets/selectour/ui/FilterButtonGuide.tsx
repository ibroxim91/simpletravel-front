'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const STORAGE_KEY = 'simple_travel_filter_button_guide_completed';
const SHOW_MS = 3600;
const MOBILE_QUERY = '(max-width: 1023px)';
const TARGET = '[data-filter-guide="open"]';

type Rect = { top: number; left: number; width: number; height: number };

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function readCompleted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function writeCompleted() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
}

function pageScrollTop() {
  return (
    document.scrollingElement?.scrollTop ||
    window.scrollY ||
    document.documentElement.scrollTop ||
    0
  );
}

function findTarget() {
  const el = document.querySelector(TARGET);
  if (!(el instanceof HTMLElement) || el.getClientRects().length === 0) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;
  return el;
}

const BUTTON_TOP = 88;

function scrollGuideFrame(button: HTMLElement) {
  const scrolling = document.scrollingElement ?? document.documentElement;
  const delta = button.getBoundingClientRect().top - BUTTON_TOP;
  if (Math.abs(delta) < 12) return Promise.resolve();

  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener('scroll', onScroll, true);
      resolve();
    };
    let timer = window.setTimeout(finish, 900);
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, 140);
    };
    window.addEventListener('scroll', onScroll, true);
    const top = Math.max(0, scrolling.scrollTop + delta);
    scrolling.scrollTo({ top, behavior: 'smooth' });
  });
}

export default function FilterButtonGuide() {
  const t = useTranslations();
  const markerId = useId().replace(/:/g, '');
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Rect | null>(null);
  const [tipSize, setTipSize] = useState({ width: 260, height: 84 });
  const tipRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const media = window.matchMedia(MOBILE_QUERY);

    const run = async () => {
      if (cancelled || !media.matches || readCompleted()) return;
      const el = findTarget();
      if (!el) return;
      await scrollGuideFrame(el);
      if (cancelled || !findTarget()) return;
      writeCompleted();
      setOpen(true);
    };

    const timer = window.setTimeout(() => {
      void run();
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(finish, SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [open, finish]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    skipRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
  }, [open, finish]);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = pageScrollTop();
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyTouchAction: body.style.touchAction,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.touchAction = 'none';

    const preventScroll = (event: Event) => {
      event.preventDefault();
    };
    const preventKeys = (event: KeyboardEvent) => {
      const blocks = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      if (!blocks.includes(event.key)) return;
      const eventTarget = event.target;
      if (eventTarget instanceof HTMLElement && eventTarget.closest('button, a, input, textarea')) {
        return;
      }
      event.preventDefault();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeys);

    return () => {
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscroll;
      body.style.overflow = previous.bodyOverflow;
      body.style.overscrollBehavior = previous.bodyOverscroll;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.left = previous.bodyLeft;
      body.style.right = previous.bodyRight;
      body.style.width = previous.bodyWidth;
      body.style.touchAction = previous.bodyTouchAction;
      window.scrollTo(0, scrollY);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeys);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = findTarget();
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
      setTarget((prev) => {
        if (
          prev &&
          prev.top === next.top &&
          prev.left === next.left &&
          prev.width === next.width &&
          prev.height === next.height
        ) {
          return prev;
        }
        return next;
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open]);

  useLayoutEffect(() => {
    if (!tipRef.current) return;
    const rect = tipRef.current.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    setTipSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, [open, target, t]);

  if (!mounted || !open || !target) return null;

  const pad = 4;
  const hole = {
    top: target.top - pad,
    left: target.left - pad,
    width: target.width + pad * 2,
    height: target.height + pad * 2,
  };
  const spaceBelow = window.innerHeight - (hole.top + hole.height);
  const placement = spaceBelow >= tipSize.height + 28 ? 'bottom' : 'top';
  const tipLeft = clamp(
    hole.left,
    28,
    window.innerWidth - tipSize.width - 12,
  );
  const tipTop = clamp(
    placement === 'bottom'
      ? hole.top + hole.height + 28
      : hole.top - 28 - tipSize.height,
    84,
    window.innerHeight - tipSize.height - 12,
  );
  const arrowFrom = {
    x: clamp(hole.left + hole.width / 2, tipLeft + 24, tipLeft + tipSize.width - 24),
    y: placement === 'bottom' ? tipTop + 2 : tipTop + tipSize.height - 2,
  };
  const arrowTo = {
    x: hole.left + hole.width / 2,
    y: placement === 'bottom' ? hole.top + hole.height - 2 : hole.top + 2,
  };
  const dx = arrowTo.x - arrowFrom.x;
  const dy = arrowTo.y - arrowFrom.y;
  const length = Math.hypot(dx, dy) || 1;
  const control = {
    x: (arrowFrom.x + arrowTo.x) / 2 - (dy / length) * 22,
    y: (arrowFrom.y + arrowTo.y) / 2 + (dx / length) * 22,
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] animate-in fade-in duration-300">
      <div className="absolute inset-0" />
      <div
        className="pointer-events-none absolute"
        style={{
          top: hole.top,
          left: hole.left,
          width: hole.width,
          height: hole.height,
          borderRadius: 999,
          boxShadow:
            '0 0 0 2px rgba(125,211,252,0.95), 0 0 18px 5px rgba(26,115,232,0.85), 0 0 36px 10px rgba(26,115,232,0.35), 0 0 0 9999px rgba(0,0,0,0.6)',
        }}
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <filter id={`${markerId}-glow`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id={`${markerId}-head`}
            markerWidth="8"
            markerHeight="8"
            refX="6.5"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#7DD3FC" />
          </marker>
        </defs>
        <path
          d={`M ${arrowFrom.x} ${arrowFrom.y} Q ${control.x} ${control.y} ${arrowTo.x} ${arrowTo.y}`}
          fill="none"
          stroke="#7DD3FC"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd={`url(#${markerId}-head)`}
          filter={`url(#${markerId}-glow)`}
        />
      </svg>
      <div
        ref={tipRef}
        role="dialog"
        aria-modal="false"
        aria-live="polite"
        className="pointer-events-none absolute w-[min(17.5rem,calc(100vw-1.5rem))]"
        style={{ top: tipTop, left: tipLeft }}
      >
        <div
          className={`relative rounded-2xl border border-[#D6E6FF] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(11,61,145,0.18)] animate-in fade-in zoom-in-95 duration-300 ${
            placement === 'top' ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'
          }`}
        >
          <p className="text-[15px] font-bold leading-5 text-[#1A73E8]">
            {t('filter_guide_title')}
          </p>
          <p className="mt-1 text-[13px] font-medium leading-[18px] text-[#4B5563]">
            {t('filter_guide_desc')}
          </p>
        </div>
      </div>
      <button
        ref={skipRef}
        type="button"
        onClick={finish}
        className="pointer-events-auto fixed right-4 top-[84px] z-[130] rounded-full border border-white/80 bg-[#0B1B33]/40 px-4 py-1.5 text-[14px] font-medium text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] backdrop-blur-sm"
      >
        {t('search_onboarding_skip')}
      </button>
    </div>,
    document.body,
  );
}
