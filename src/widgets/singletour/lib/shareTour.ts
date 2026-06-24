export function extractShareTokenFromSlug(slug: string): string | null {
  if (!slug) return null;

  const shareIndex = slug.toLowerCase().lastIndexOf('share');
  if (shareIndex === -1) return null;

  const token = slug.slice(shareIndex + 'share'.length).trim();
  return token.length > 0 ? token : null;
}

export function readStoredTour(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('tour');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getSlugFromTourParam(tourid: string | string[] | undefined): string {
  if (!tourid) return '';
  if (Array.isArray(tourid)) {
    return tourid[tourid.length - 1] ?? '';
  }
  return tourid;
}

export function isStoredTourMatchingShareToken(
  storedTour: { share_token?: string } | null,
  urlShareToken: string | null,
): boolean {
  if (!storedTour) return false;
  if (!urlShareToken) return true;
  return String(storedTour.share_token ?? '') === urlShareToken;
}

export function resolveTourFromStorage(
  storedTour: Record<string, any> | null,
  urlShareToken: string | null,
): Record<string, any> | null {
  if (!storedTour) return null;
  if (isStoredTourMatchingShareToken(storedTour, urlShareToken)) {
    return storedTour;
  }
  return null;
}

export function shouldFetchSharedTour(
  storedTour: Record<string, any> | null,
  urlShareToken: string | null,
): boolean {
  if (!urlShareToken) return false;
  return !isStoredTourMatchingShareToken(storedTour, urlShareToken);
}
