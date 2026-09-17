'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const IDLE_MS = 15_000;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'idle_help_cooldown_until';

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'touchmove',
  'pointerdown',
];

function isCooldownActive(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    if (!Number.isFinite(until)) return false;
    return Date.now() < until;
  } catch {
    return false;
  }
}

export function setIdleHelpCooldown(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now() + COOLDOWN_MS));
  } catch {
    // ignore quota / private mode
  }
}

export function useIdleHelpPrompt(enabled = true) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const armTimer = useCallback(() => {
    clearTimer();
    if (!enabled || openRef.current || isCooldownActive()) return;

    timerRef.current = setTimeout(() => {
      if (openRef.current || isCooldownActive()) return;
      setOpen(true);
    }, IDLE_MS);
  }, [clearTimer, enabled]);

  useEffect(() => {
    if (!enabled) {
      clearTimer();
      return;
    }

    if (open) {
      clearTimer();
      return;
    }

    armTimer();

    const onActivity = () => {
      if (openRef.current) return;
      armTimer();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }

    return () => {
      clearTimer();
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
    };
  }, [armTimer, clearTimer, enabled, open]);

  const dismiss = useCallback(() => {
    setIdleHelpCooldown();
    setOpen(false);
  }, []);

  const closeAfterSuccess = useCallback(() => {
    setIdleHelpCooldown();
    setOpen(false);
  }, []);

  return { open, dismiss, closeAfterSuccess, setOpen };
}
