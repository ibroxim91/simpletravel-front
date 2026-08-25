const SESSION_STORAGE_KEY = 'analytics_session_id';

export type AnalyticsEventType = 'page_view' | 'tour_search' | 'tour_detail_view';

function generateSessionId(): string {
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

  const sessionId = generateSessionId();
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

export async function trackAnalyticsEvent(
  eventType: AnalyticsEventType,
  metadata: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') {
    return;
  }

  const sessionId = getAnalyticsSessionId();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl || !sessionId) {
    return;
  }

  try {
    await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/analytics/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Analytics-Session': sessionId,
        'X-Platform': 'web',
      },
      body: JSON.stringify({
        event_type: eventType,
        session_id: sessionId,
        metadata: {
          locale: localStorage.getItem('locale') || 'uz',
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
  await trackAnalyticsEvent('page_view', {
    page,
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
  operator?: string | null;
};

export async function trackTourDetail(meta: TourDetailMetadata) {
  await trackAnalyticsEvent('tour_detail_view', {
    page: meta.tour_id ? `/selectour/${meta.tour_id}` : '/selectour',
    ...meta,
  });
}
