export const DEFAULT_ADULTS = 2;

export function resolveAdultsCount(adults?: number | string | null): number {
  if (adults == null || adults === '') {
    return DEFAULT_ADULTS;
  }

  const parsed = typeof adults === 'string' ? parseInt(adults, 10) : adults;
  return parsed > 0 ? parsed : DEFAULT_ADULTS;
}

export function adultsForSearch(adults: number): number {
  return adults > 0 ? adults : DEFAULT_ADULTS;
}

export function getPassengerDisplayCount(adults: number, children: number): number {
  return adultsForSearch(adults) + children;
}
