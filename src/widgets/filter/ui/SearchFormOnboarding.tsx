'use client';

import { getHomePopupPhase, subscribeHomePopupPhase } from '@/features/home/lib/homeOverlayQueue';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/** false: guide faqat birinchi tashrifda chiqadi. */
export const SEARCH_ONBOARDING_ALWAYS_SHOW = false;

const STORAGE_KEY = 'simple_travel_search_onboarding_completed';
const STEP_MS = 1800;
const MOBILE_QUERY = '(max-width: 1023px)';
const VIEWPORT_MARGIN = 12;
const ARROW_GAP = 28;

type TargetId = 'destination' | 'dates' | 'passengers' | 'search';
type Placement = 'top' | 'bottom';
type Align = 'start' | 'center' | 'end';

type Step = {
  id: number;
  target: TargetId;
  prefer: Placement;
  align: Align;
  titleKey: string;
  descKey: string;
  radius: number;
};

const STEPS: Step[] = [
  {
    id: 1,
    target: 'destination',
    prefer: 'top',
    align: 'center',
    titleKey: 'search_onboarding_step1_title',
    descKey: 'search_onboarding_step1_desc',
    radius: 12,
  },
  {
    id: 2,
    target: 'dates',
    prefer: 'bottom',
    align: 'start',
    titleKey: 'search_onboarding_step2_title',
    descKey: 'search_onboarding_step2_desc',
    radius: 12,
  },
  {
    id: 3,
    target: 'passengers',
    prefer: 'bottom',
    align: 'end',
    titleKey: 'search_onboarding_step3_title',
    descKey: 'search_onboarding_step3_desc',
    radius: 12,
  },
  {
    id: 4,
    target: 'search',
    prefer: 'bottom',
    align: 'center',
    titleKey: 'search_onboarding_step4_title',
    descKey: 'search_onboarding_step4_desc',
    radius: 14,
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function clamp(value: number, min: number, max: number) {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function isVisibleTarget(el: Element | null): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  if (el.getClientRects().length === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
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

function scrollPageToTop() {
  const scrolling = document.scrollingElement ?? document.documentElement;
  const previous = scrolling.style.scrollBehavior;
  scrolling.style.scrollBehavior = 'auto';
  scrolling.scrollTop = 0;
  window.scrollTo(0, 0);
  scrolling.style.scrollBehavior = previous;
}

export default function SearchFormOnboarding() {
  const t = useTranslations();
  const markerId = useId().replace(/:/g, '');
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [target, setTarget] = useState<Rect | null>(null);
  const [tipSize, setTipSize] = useState({ width: 260, height: 92 });
  const tipRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    writeCompleted();
    setOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const media = window.matchMedia(MOBILE_QUERY);

    let started = false;
    let queued = false;

    const tryOpen = () => {
      if (cancelled || started || queued || !media.matches) return;
      if (getHomePopupPhase() !== 'clear') return;
      if (!SEARCH_ONBOARDING_ALWAYS_SHOW && readCompleted()) return;
      queued = true;

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          queued = false;
          if (cancelled || started || getHomePopupPhase() !== 'clear') return;
          const destination = document.querySelector('[data-search-guide="destination"]');
          if (!isVisibleTarget(destination)) return;

          const start = () => {
            if (cancelled || started) return;
            started = true;
            setTarget(null);
            setStepIndex(0);
            setOpen(true);
          };

          if (pageScrollTop() > 0) {
            scrollPageToTop();
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(start);
            });
            return;
          }

          start();
        });
      });
    };

    const unsubscribe = subscribeHomePopupPhase(tryOpen);
    const timer = window.setTimeout(tryOpen, 450);
    return () => {
      cancelled = true;
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      if (stepIndex >= STEPS.length - 1) finish();
      else setStepIndex((current) => current + 1);
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [open, stepIndex, finish]);

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
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => {
      if (!media.matches) setOpen(false);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [open]);

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
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('button, a, input, textarea')) return;
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

  const step = STEPS[stepIndex];

  useEffect(() => {
    if (!open || !step) return;

    const readRect = () => {
      const el = document.querySelector(`[data-search-guide="${step.target}"]`);
      if (!isVisibleTarget(el)) return null;
      const rect = el.getBoundingClientRect();
      return {
        el,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
      };
    };

    const apply = (rect: Rect) => {
      setTarget((prev) => {
        if (
          prev &&
          prev.top === rect.top &&
          prev.left === rect.left &&
          prev.width === rect.width &&
          prev.height === rect.height
        ) {
          return prev;
        }
        return rect;
      });
    };

    const first = readRect();
    if (first) apply(first.rect);

    const measure = () => {
      const next = readRect();
      if (next) apply(next.rect);
    };

    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('scroll', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('scroll', measure);
    };
  }, [open, step]);

  useLayoutEffect(() => {
    if (!tipRef.current) return;
    const rect = tipRef.current.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    setTipSize((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, [open, stepIndex, target, t]);

  if (!mounted || !open || !step || !target) return null;

  const pad = 4;
  const hole = {
    top: target.top - pad,
    left: target.left - pad,
    width: target.width + pad * 2,
    height: target.height + pad * 2,
  };

  const spaceAbove = hole.top - 76;
  const spaceBelow = window.innerHeight - (hole.top + hole.height);
  let placement = step.prefer;
  const needed = tipSize.height + ARROW_GAP;
  if (placement === 'top' && spaceAbove < needed && spaceBelow > spaceAbove) {
    placement = 'bottom';
  } else if (placement === 'bottom' && spaceBelow < needed && spaceAbove > spaceBelow) {
    placement = 'top';
  }

  let tipLeft =
    step.align === 'start'
      ? hole.left
      : step.align === 'end'
        ? hole.left + hole.width - tipSize.width
        : hole.left + hole.width / 2 - tipSize.width / 2;
  tipLeft = clamp(
    tipLeft,
    VIEWPORT_MARGIN + 16,
    window.innerWidth - tipSize.width - VIEWPORT_MARGIN,
  );

  let tipTop =
    placement === 'top'
      ? hole.top - ARROW_GAP - tipSize.height
      : hole.top + hole.height + ARROW_GAP;
  tipTop = clamp(
    tipTop,
    76,
    window.innerHeight - tipSize.height - VIEWPORT_MARGIN,
  );

  const arrowFrom = {
    x: clamp(hole.left + hole.width / 2, tipLeft + 28, tipLeft + tipSize.width - 28),
    y: placement === 'top' ? tipTop + tipSize.height - 2 : tipTop + 2,
  };
  const arrowTo = {
    x: hole.left + hole.width / 2,
    y: placement === 'top' ? hole.top + 2 : hole.top + hole.height - 2,
  };
  const dx = arrowTo.x - arrowFrom.x;
  const dy = arrowTo.y - arrowFrom.y;
  const length = Math.hypot(dx, dy) || 1;
  const control = {
    x: (arrowFrom.x + arrowTo.x) / 2 - (dy / length) * 26,
    y: (arrowFrom.y + arrowTo.y) / 2 + (dx / length) * 26,
  };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[120] animate-in fade-in duration-300">
      <div
        className="absolute transition-[top,left,width,height] duration-500 ease-out"
        style={{
          top: hole.top,
          left: hole.left,
          width: hole.width,
          height: hole.height,
          borderRadius: step.radius,
          boxShadow:
            '0 0 0 2px rgba(125,211,252,0.95), 0 0 18px 5px rgba(26,115,232,0.85), 0 0 36px 10px rgba(26,115,232,0.35), 0 0 0 9999px rgba(0,0,0,0.6)',
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
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
        key={step.id}
        className="absolute w-[min(17.5rem,calc(100vw-1.5rem))]"
        style={{ top: tipTop, left: tipLeft }}
      >
        <div
          role="dialog"
          aria-modal="false"
          aria-live="polite"
          id="search-onboarding-tip"
          className={`relative rounded-2xl border border-[#D6E6FF] bg-white px-4 py-3 pl-5 shadow-[0_10px_28px_rgba(11,61,145,0.18)] animate-in fade-in zoom-in-95 duration-300 ${
            placement === 'top' ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'
          }`}
        >
          <span className="absolute -left-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-[#1A73E8] text-[15px] font-bold text-white shadow-[0_0_0_3px_rgba(255,255,255,0.92),0_0_14px_rgba(26,115,232,0.85)]">
            {step.id}
          </span>
          <p className="text-[15px] font-bold leading-5 text-[#1A73E8]">
            {t(step.titleKey)}
          </p>
          <p className="mt-1 text-[13px] font-medium leading-[18px] text-[#4B5563]">
            {t(step.descKey)}
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
