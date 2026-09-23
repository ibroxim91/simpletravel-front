export type HomePopupPhase = 'unknown' | 'popup' | 'clear';

let phase: HomePopupPhase = 'unknown';
const listeners = new Set<() => void>();

export function getHomePopupPhase(): HomePopupPhase {
  return phase;
}

export function setHomePopupPhase(next: HomePopupPhase) {
  if (phase === next) return;
  phase = next;
  listeners.forEach((listener) => listener());
}

export function subscribeHomePopupPhase(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
