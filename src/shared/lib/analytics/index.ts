import { getToken } from '@/shared/config/api/saveToke';

const SESSION_STORAGE_KEY = 'analytics_session_id';
const DEVICE_STORAGE_KEY = 'analytics_device_id';

export type AnalyticsEventType = 'page_view' | 'tour_search' | 'tour_detail_view';

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getAnalyticsSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const sessionId = generateId();
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

/** Stable anonymous device/browser id (survives reloads; not rotated per session). */
export function getAnalyticsDeviceId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const deviceId = generateId();
  localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
  return deviceId;
}

const PAGE_NAME_BY_PATH: Record<string, string> = {
  '/': 'Главная',
  '/selectour': 'Поиск туров',
  '/about': 'О нас',
  '/contacts': 'Контакты',
  '/profile': 'Профиль',
  '/saved': 'Сохраненные туры',
  '/auth/login': 'Вход',
  '/auth/register': 'Регистрация',
  '/booking': 'Бронирование',
};

export function resolveWebPageName(pathname: string): string {
  if (!pathname) return 'Неизвестно';
  const normalized = pathname.replace(/^\/(uz|ru)(?=\/|$)/, '') || '/';
  if (PAGE_NAME_BY_PATH[normalized]) return PAGE_NAME_BY_PATH[normalized];
  if (/^\/selectour\/[^/]+/.test(normalized)) return 'Детали тура';
  if (normalized.startsWith('/profile')) return 'Профиль';
  if (normalized.startsWith('/auth')) return 'Авторизация';
  if (normalized.startsWith('/selectour')) return 'Поиск туров';
  return normalized.slice(0, 64);
}

/** Tour detail pages are tracked via tour_detail_view only — skip page_view. */
export function isTourDetailPath(pathname: string): boolean {
  if (!pathname) return false;
  const normalized = pathname.replace(/^\/(uz|ru)(?=\/|$)/, '') || '/';
  return (
    /^\/selectour\/[^/]+/.test(normalized) ||
    normalized === '/selectour/detail' ||
    /^\/tour\/[^/]+/.test(normalized)
  );
}

export async function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  metadata: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') {
    return;
  }

  const sessionId = getAnalyticsSessionId();
  const deviceId = getAnalyticsDeviceId();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl || !sessionId || !deviceId) {
    return;
  }

  const page = typeof metadata.page === 'string' ? metadata.page : '';
  const pageName =
    (typeof metadata.page_name === 'string' && metadata.page_name) ||
    resolveWebPageName(page);
  const accessToken = getToken();

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Analytics-Session': sessionId,
      'X-Analytics-Device': deviceId,
      'X-Platform': 'web',
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/analytics/events/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        event_type: eventType,
        session_id: sessionId,
        device_id: deviceId,
        page_name: pageName,
        metadata: {
          locale: localStorage.getItem('locale') || 'uz',
          device_id: deviceId,
          page_name: pageName,
          ...metadata,
        },
      }),
      keepalive: true,
    });
  } catch {
    // analytics must not break UX
  }
}

export async function trackPageView(page: string, locale?: string) {
  if (!page) return;
  // tour_detail_view already covers tour detail visits
  if (isTourDetailPath(page)) return;
  await trackAnalyticsEvent('page_view', {
    page,
    page_name: resolveWebPageName(page),
    locale: locale || localStorage.getItem('locale') || 'uz',
    referrer: document.referrer || '',
  });
}

export type TourSearchMetadata = {
  departure_id?: string | number | null;
  departure_name?: string | null;
  destination_id?: string | number | null;
  destination_name?: string | null;
  country_id?: string | number | null;
  country_name?: string | null;
  passenger_count?: string | number | null;
  adults?: string | number | null;
  children?: string | number | null;
  date_from?: string | null;
  date_to?: string | null;
  result_count?: number | null;
};

export async function trackTourSearch(meta: TourSearchMetadata) {
  await trackAnalyticsEvent('tour_search', {
    page: '/selectour',
    page_name: 'Поиск туров',
    ...meta,
  });
}

export type TourDetailMetadata = {
  tour_id?: string | number | null;
  title?: string | null;
  destination_name?: string | null;
  departure_name?: string | null;
  duration_days?: string | number | null;
  passenger_count?: string | number | null;
  price?: string | number | null;
  price_full?: string | number | null;
  operator_price?: string | number | null;
  operator?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  travel_time?: string | null;
};

export async function trackTourDetail(meta: TourDetailMetadata) {
  const rawId = meta.tour_id != null ? String(meta.tour_id) : '';
  // Prefer short ids for analytics; giant operator hex blobs break UX/storage.
  const tourId = rawId.length > 64 ? rawId.slice(0, 64) : rawId;
  await trackAnalyticsEvent('tour_detail_view', {
    page: tourId ? `/selectour/${tourId}` : '/selectour',
    page_name: 'Детали тура',
    ...meta,
    tour_id: tourId || meta.tour_id,
  });
}
