type DestinationFallback = {
  destination?: string | null;
  country_id?: string | null;
};

export const DESTINATION_DEPENDENT_PARAMS = new Set([
  'town',
  'rating',
  'meal',
  'duration',
]);

export function ensureDestinationInParams(
  params: URLSearchParams,
  fallback?: DestinationFallback,
) {
  if (params.get('destination') || params.get('country_id')) {
    return;
  }

  const destination = fallback?.destination?.trim();
  const countryId = fallback?.country_id?.trim();

  if (destination) {
    params.set('destination', destination);
    return;
  }

  if (countryId) {
    params.set('country_id', countryId);
    return;
  }

  try {
    const raw = localStorage.getItem('filterTours');
    if (!raw) return;

    const stored = JSON.parse(raw) as DestinationFallback;
    if (stored.destination) {
      params.set('destination', String(stored.destination));
    } else if (stored.country_id) {
      params.set('country_id', String(stored.country_id));
    }
  } catch {
    // ignore invalid localStorage
  }
}
