'use client';

import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import Ticket_Api from '@/widgets/selectour/lib/api';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  chunkOffers,
  groupHotOffersByRegion,
  type HotPromoOffer,
  type HotPromoRegion,
} from '../lib/groupHotOffersByRegion';

const PRICES_PER_PAGE = 3;
const REGION_AUTOPLAY_MS = 4000;

function RegionPricePages({
  region,
  locale,
  onOfferClick,
}: {
  region: HotPromoRegion;
  locale: LanguageRoutes;
  onOfferClick: (offer: HotPromoOffer) => void;
}) {
  const t = useTranslations();
  const pages = useMemo(
    () => chunkOffers(region.offers, PRICES_PER_PAGE),
    [region.offers],
  );
  const [priceApi, setPriceApi] = useState<CarouselApi>();
  const [priceIndex, setPriceIndex] = useState(0);

  useEffect(() => {
    if (!priceApi) return;
    const onSelect = () => setPriceIndex(priceApi.selectedScrollSnap());
    onSelect();
    priceApi.on('select', onSelect);
    return () => {
      priceApi.off('select', onSelect);
    };
  }, [priceApi]);

  if (pages.length <= 1) {
    return (
      <div className="space-y-2.5">
        {(pages[0] ?? []).map((offer) => (
          <OfferRow
            key={`${offer.destinationName}-${offer.dateSortKey}-${offer.ticketId}`}
            offer={offer}
            locale={locale}
            onClick={() => onOfferClick(offer)}
            otLabel={t('от')}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Carousel
        setApi={setPriceApi}
        opts={{ align: 'start', loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {pages.map((page, pageIdx) => (
            <CarouselItem key={pageIdx} className="basis-full pl-0">
              <div className="space-y-2.5">
                {page.map((offer) => (
                  <OfferRow
                    key={`${offer.destinationName}-${offer.dateSortKey}-${offer.ticketId}`}
                    offer={offer}
                    locale={locale}
                    onClick={() => onOfferClick(offer)}
                    otLabel={t('от')}
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`prices-page-${i + 1}`}
            onClick={() => priceApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === priceIndex ? 'w-5 bg-[#1A73E8]' : 'w-1.5 bg-[#C5D5F0]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function OfferRow({
  offer,
  locale,
  otLabel,
  onClick,
}: {
  offer: HotPromoOffer;
  locale: LanguageRoutes;
  otLabel: string;
  onClick: () => void;
}) {
  const displayPrice = Math.round(offer.priceUzs * 0.5);

  return (
    <Link
      href={`/selectour/${offer.slug || ''}`}
      prefetch
      onClick={onClick}
      className="flex items-baseline justify-between gap-3 rounded-xl bg-[#F5F9FF] px-3.5 py-3 transition hover:bg-[#E8F1FF]"
    >
      <span className="min-w-0 flex-1 text-[15px] font-medium leading-5 text-[#1A73E8]">
        {offer.destinationName ? (
          <span className="mr-1.5 text-[#0B3D91]">{offer.destinationName}</span>
        ) : null}
        {offer.dateLabel}{' '}
        <span className="font-normal text-[#5B7BB2]">{otLabel}</span>
      </span>
      <span className="shrink-0 text-right text-[20px] font-bold leading-6 text-[#0B3D91]">
        {formatPrice(displayPrice, locale, true)}
      </span>
    </Link>
  );
}

const HotOffersPromoPopup = () => {
  const t = useTranslations();
  const { locale } = useParams() as { locale: LanguageRoutes };
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [regionApi, setRegionApi] = useState<CarouselApi>();
  const [regionIndex, setRegionIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { data: tickets, isSuccess } = useQuery({
    queryKey: ['home_offers_hot', 'hot'],
    queryFn: async () => {
      try {
        return await Ticket_Api.GetHomeOffers({ hot: true, page: 1 });
      } catch {
        return await Ticket_Api.GetHomeTickets();
      }
    },
    select: (res) => res?.data?.results?.tickets ?? [],
  });

  const regions = useMemo(
    () => groupHotOffersByRegion(tickets),
    [tickets],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isSuccess || regions.length === 0) return;
    const timer = window.setTimeout(() => setOpen(true), 400);
    return () => window.clearTimeout(timer);
  }, [isSuccess, regions.length]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!regionApi) return;
    const onSelect = () => {
      setRegionIndex(regionApi.selectedScrollSnap());
      setCanScrollPrev(regionApi.canScrollPrev());
      setCanScrollNext(regionApi.canScrollNext());
    };
    onSelect();
    regionApi.on('select', onSelect);
    regionApi.on('reInit', onSelect);
    return () => {
      regionApi.off('select', onSelect);
      regionApi.off('reInit', onSelect);
    };
  }, [regionApi]);

  useEffect(() => {
    if (!open || !regionApi || regions.length <= 1) return;
    const timer = window.setInterval(() => {
      regionApi.scrollNext();
    }, REGION_AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [open, regionApi, regions.length]);

  const persistTicketClick = (offer: HotPromoOffer) => {
    const item = offer.raw as Record<string, unknown> | null;
    if (!item) return;
    try {
      localStorage.setItem('tourOperator', String(item.operator ?? ''));
      localStorage.setItem('from_cache', String(item.from_cache ?? ''));
      localStorage.setItem('tour', JSON.stringify(item));
      localStorage.setItem(
        'tourOperatorId',
        String(item.tour_operator_id ?? ''),
      );
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!mounted || !open || regions.length === 0) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4 animate-in fade-in duration-200"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('hot_promo_title')}
        className="relative w-full max-w-[380px] overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(11,61,145,0.28)] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </button>

        <Carousel
          setApi={setRegionApi}
          opts={{ align: 'start', loop: regions.length > 1 }}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {regions.map((region) => (
              <CarouselItem key={region.regionKey} className="basis-full pl-0">
                <div className="relative">
                  <div className="relative h-[220px] w-full overflow-hidden bg-[#1A73E8]">
                    {region.imageUrl ? (
                      <Image
                        src={region.imageUrl}
                        alt={region.regionName}
                        fill
                        className="object-cover"
                        sizes="380px"
                        unoptimized={region.imageUrl.startsWith('http')}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D91]/95 via-[#1A73E8]/45 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-16 text-center">
                      <h2 className="text-[28px] font-bold leading-8 text-white drop-shadow-sm">
                        {region.regionName}
                      </h2>
                      <span className="mt-2 inline-flex rounded-full border border-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        {t('hot_promo_from_tashkent')}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-5 pt-4">
                    <p className="mb-3 text-center text-sm font-medium text-[#6B7280]">
                      {t('hot_promo_title')}
                    </p>
                    <RegionPricePages
                      region={region}
                      locale={locale}
                      onOfferClick={persistTicketClick}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {regions.length > 1 ? (
          <div className="flex items-center justify-between gap-2 border-t border-[#E8EEF7] px-4 py-3">
            <button
              type="button"
              aria-label="prev-region"
              disabled={!canScrollPrev}
              onClick={() => regionApi?.scrollPrev()}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#E8F1FF] text-[#1A73E8] disabled:opacity-40"
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: 22 }} />
            </button>
            <div className="flex items-center gap-1.5">
              {regions.map((region, i) => (
                <button
                  key={region.regionKey}
                  type="button"
                  aria-label={`region-${i + 1}`}
                  onClick={() => regionApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === regionIndex ? 'w-5 bg-[#1A73E8]' : 'w-1.5 bg-[#C5D5F0]'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="next-region"
              disabled={!canScrollNext}
              onClick={() => regionApi?.scrollNext()}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#E8F1FF] text-[#1A73E8] disabled:opacity-40"
            >
              <KeyboardArrowRightIcon sx={{ fontSize: 22 }} />
            </button>
          </div>
        ) : (
          <div className="h-3" />
        )}
      </div>
    </div>,
    document.body,
  );
};

export default HotOffersPromoPopup;
