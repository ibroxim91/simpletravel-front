export type HotPromoOffer = {
  ticketId: number;
  destinationName: string;
  dateLabel: string;
  dateSortKey: string;
  priceUzs: number;
  slug: string;
  raw: unknown;
};

export type HotPromoRegion = {
  regionKey: string;
  regionId: number;
  regionName: string;
  imageUrl: string;
  offers: HotPromoOffer[];
  minPriceUzs: number;
};

function resolvePriceUzs(ticket: Record<string, unknown>): number {
  const full = Number(ticket.price_full);
  if (Number.isFinite(full) && full > 0) return full;

  const price = Number(ticket.price);
  if (!Number.isFinite(price) || price <= 0) return 0;
  // Home-offer cards often store price already in millions (e.g. 7.2)
  return price < 1000 ? price * 1_000_000 : price;
}

function parseDepartureDate(ticket: Record<string, unknown>): {
  label: string;
  sortKey: string;
} | null {
  const raw =
    String(ticket.departure_date || ticket.departure_time || '').trim();
  if (!raw) return null;

  // YYYYMMDD
  if (/^\d{8}$/.test(raw)) {
    const y = raw.slice(0, 4);
    const m = raw.slice(4, 6);
    const d = raw.slice(6, 8);
    return { label: `${d}.${m}`, sortKey: raw };
  }

  // ISO / YYYY-MM-DD / with time
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return { label: `${d}.${m}`, sortKey: `${y}${m}${d}` };
  }

  // DD.MM.YYYY or DD.MM
  const dotMatch = raw.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?/);
  if (dotMatch) {
    const d = dotMatch[1].padStart(2, '0');
    const m = dotMatch[2].padStart(2, '0');
    const y = dotMatch[3] || '9999';
    return { label: `${d}.${m}`, sortKey: `${y}${m}${d}` };
  }

  return { label: raw.slice(0, 5), sortKey: raw };
}

function ticketImage(ticket: Record<string, unknown>): string {
  const ticketImages = String(ticket.ticket_images || '').trim();
  if (ticketImages) return ticketImages;
  return String(ticket.hotel_photo || '').trim();
}

/**
 * Groups hot-offer towns into one slide per country.
 * Ticket.destination.name is the town (Hadaba, Naama Bay…);
 * destination_id is the parent SAMO region; country_id / destination.country
 * is the country (Egypt, China…) — that is the popup carousel unit.
 */
export function groupHotOffersByRegion(
  tickets: unknown[] | undefined | null,
): HotPromoRegion[] {
  if (!Array.isArray(tickets) || tickets.length === 0) return [];

  const byCountry = new Map<string, HotPromoRegion>();

  for (const item of tickets) {
    if (!item || typeof item !== 'object') continue;
    const ticket = item as Record<string, unknown>;
    const destination = (ticket.destination || {}) as Record<string, unknown>;
    const country = (destination.country || {}) as Record<string, unknown>;

    const countryId = Number(
      ticket.country_id ?? country.id ?? 0,
    );
    const countryName = String(country.name || '').trim();
    // Fallback: parent region id when country is missing on the payload
    const regionId = Number(ticket.destination_id ?? 0);
    const townName = String(destination.name || '').trim();

    const groupName = countryName || townName;
    if (!groupName) continue;

    const dateInfo = parseDepartureDate(ticket);
    if (!dateInfo) continue;

    const priceUzs = resolvePriceUzs(ticket);
    if (priceUzs <= 0) continue;

    const regionKey =
      countryId > 0
        ? `country:${countryId}`
        : regionId > 0
          ? `region:${regionId}`
          : `name:${groupName}`;

    let group = byCountry.get(regionKey);
    if (!group) {
      group = {
        regionKey,
        regionId: countryId || regionId,
        regionName: groupName,
        imageUrl: ticketImage(ticket),
        offers: [],
        minPriceUzs: priceUzs,
      };
      byCountry.set(regionKey, group);
    }

    if (!group.imageUrl) {
      group.imageUrl = ticketImage(ticket);
    } else {
      // Prefer ticket_images when a later ticket has it
      const fromTicketImages = String(ticket.ticket_images || '').trim();
      if (fromTicketImages) {
        group.imageUrl = fromTicketImages;
      }
    }
    // Prefer country name if a fallback town title was set first
    if (countryName && group.regionName !== countryName) {
      group.regionName = countryName;
    }

    const offerKey = `${dateInfo.sortKey}:${townName || 'any'}`;
    const existing = group.offers.find(
      (o) => `${o.dateSortKey}:${o.destinationName || 'any'}` === offerKey,
    );
    if (existing) {
      if (priceUzs < existing.priceUzs) {
        existing.priceUzs = priceUzs;
        existing.ticketId = Number(ticket.id) || existing.ticketId;
        existing.slug = String(ticket.slug || existing.slug);
        existing.destinationName = townName || existing.destinationName;
        existing.raw = ticket;
      }
    } else {
      group.offers.push({
        ticketId: Number(ticket.id) || 0,
        destinationName: townName,
        dateLabel: dateInfo.label,
        dateSortKey: dateInfo.sortKey,
        priceUzs,
        slug: String(ticket.slug || ''),
        raw: ticket,
      });
    }

    group.minPriceUzs = Math.min(group.minPriceUzs, priceUzs);
  }

  const regions = Array.from(byCountry.values());
  for (const region of regions) {
    region.offers.sort((a, b) => a.dateSortKey.localeCompare(b.dateSortKey));
  }
  regions.sort((a, b) => a.minPriceUzs - b.minPriceUzs);
  return regions;
}

export function chunkOffers<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}
