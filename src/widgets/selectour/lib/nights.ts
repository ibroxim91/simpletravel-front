/** SAMO NIGHTS_LIST presets for tour search. */
export const NIGHTS_FROM_7 = '7,8,9,10,11,12,13,14';
export const NIGHTS_ALL = '2,3,4,5,6,7,8,9,10,11,12,13,14';

/**
 * Resolve nights list for search API.
 * Manual duration selection always wins; otherwise switch controls the preset.
 */
export function resolveNightsList(
  durationDays?: string | number | null,
  onlyFrom7 = true,
): string {
  if (durationDays !== null && durationDays !== undefined && String(durationDays).trim()) {
    return String(durationDays).trim();
  }
  return onlyFrom7 ? NIGHTS_FROM_7 : NIGHTS_ALL;
}

export function parseDurationList(value?: string | number | null): string[] {
  if (value === null || value === undefined || value === '') return [];
  return String(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}
