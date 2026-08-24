const SESSION_STORAGE_KEY = 'analytics_session_id';

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

export async function trackPageView(page: string, locale?: string) {
  if (typeof window === 'undefined' || !page) {
    return;
  }

  const sessionId = getAnalyticsSessionId();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return;
  }

  try {
    await fetch(`${baseUrl.replace(/\/$/, '')}/analytics/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Analytics-Session': sessionId,
        'X-Platform': 'web',
      },
      body: JSON.stringify({
        event_type: 'page_view',
        session_id: sessionId,
        metadata: {
          page,
          locale: locale || localStorage.getItem('locale') || 'uz',
          referrer: document.referrer || '',
        },
      }),
      keepalive: true,
    });
  } catch {
    // analytics must not break UX
  }
}
