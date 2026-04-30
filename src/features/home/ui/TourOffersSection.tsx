'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import { Button } from '@/shared/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import { useQuery } from '@tanstack/react-query';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TourOfferCard from './cards/TourOfferCard';

type TourOffersSectionProps = {
  queryKey: string;
  titleKey: string;
  subtitleKey: string;
  sectionClassName?: string;
  cardsStart: number;
  cardsEnd: number;
};

const TourOffersSection = ({
  queryKey,
  titleKey,
  subtitleKey,
  sectionClassName = 'bg-transparent pb-10 pt-0',
  cardsStart,
  cardsEnd,
}: TourOffersSectionProps) => {
  const t = useTranslations();
  const { locale }: any = useParams();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => Ticket_Api.GetHomeTickets(),
    select: (res) => res.data.results.tickets ?? [],
  });

  const tours = data?.slice(cardsStart, cardsEnd) ?? [];
  const carouselItems = isLoading ? Array.from({ length: 4 }) : tours;

  useEffect(() => {
    if (!carouselApi) return;
    const updateScrollState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateScrollState();
    carouselApi.on('select', updateScrollState);
    carouselApi.on('reInit', updateScrollState);
    return () => {
      carouselApi.off('select', updateScrollState);
      carouselApi.off('reInit', updateScrollState);
    };
  }, [carouselApi]);

  return (
    <section className={sectionClassName}>
      <div className="custom-container">
        <div className="mx-auto h-auto w-full max-w-[353px] rounded-[14px] bg-white px-4 pb-4 pt-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:h-auto md:max-w-[1240px] md:px-6 md:pb-6 md:pt-6 md:shadow-[0_2px_20px_rgba(0,0,0,0.15)] xl:h-[725px]">
          <div className="flex w-full flex-col gap-2 md:gap-2">
            <div className="flex w-full items-start justify-between gap-2 md:items-center">
              <h2 className="text-[20px] font-bold leading-6 text-[#1C1C1E] md:text-[32px] md:leading-[44px]">
                {t(titleKey)}
              </h2>
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  aria-label="prev"
                  disabled={!canScrollPrev}
                  className="grid h-9 w-9 place-items-center rounded-[20px] bg-[#E5E7EB]/70 text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => carouselApi?.scrollPrev()}
                >
                  <KeyboardBackspaceIcon sx={{ fontSize: 18 }} />
                </button>
                <button
                  type="button"
                  aria-label="next"
                  disabled={!canScrollNext}
                  className="grid h-9 w-9 place-items-center rounded-[20px] bg-[#E5E7EB] text-black disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => carouselApi?.scrollNext()}
                >
                  <KeyboardBackspaceIcon sx={{ fontSize: 18, transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </div>
            <p className="text-[14px] font-normal leading-[17px] text-[#6B7280] md:text-base md:leading-[22px]">
              {t(subtitleKey)}
            </p>
          </div>

          <div className="mx-auto mt-6 min-h-[356px] w-[321px] md:mx-0 md:mt-6 md:min-h-0 md:w-full">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: 'start', loop: false, containScroll: 'trimSnaps' }}
              className="w-full"
            >
              <CarouselContent className="ml-0 gap-4 md:-ml-3 md:gap-0">
                {carouselItems.map((item: any, index: number) => (
                  <CarouselItem
                    key={isLoading ? `skeleton-${index}` : item.id}
                    className="basis-[157px] pl-0 md:basis-1/2 md:pl-3 xl:basis-1/4"
                  >
                    {isLoading ? (
                      <div className="h-[356px] rounded-[14px] border border-[#E5E7EB] bg-white p-4 md:h-[483px]">
                        <Skeleton className="h-[153px] w-full rounded-[14px] md:h-[233px]" />
                        <Skeleton className="mt-4 h-5 w-4/5 md:h-6" />
                        <Skeleton className="mt-2 h-3 w-14 md:h-4" />
                        <Skeleton className="mt-3 h-3 w-1/2 md:mt-4 md:h-4" />
                        <Skeleton className="mt-2 h-3 w-1/2 md:h-4" />
                        <Skeleton className="mt-2 h-3 w-1/2 md:h-4" />
                        <Skeleton className="mt-4 h-4 w-1/3 md:h-5" />
                      </div>
                    ) : (
                      <TourOfferCard
                        item={item}
                        index={index}
                        locale={locale as LanguageRoutes}
                        fallbackDurationText={t('дней')}
                        fallbackHotelText={t('Отель')}
                        starsText={t('звёзды')}
                        onClick={() => {
                          localStorage.setItem('tourOperator', item?.operator ?? '');
                          localStorage.setItem('from_cache', item?.from_cache ?? '');
                          localStorage.setItem(
                            'tourOperatorId',
                            String(item?.tour_operator_id ?? ''),
                          );
                        }}
                      />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="mt-8 w-full md:mt-10 md:flex md:justify-center">
            <Button className="h-12 w-full rounded-[14px] bg-[#E8F1FF] text-[14px] font-medium text-[#1C1C1E] hover:bg-[#DCE8FF] md:h-[60px] md:w-[292px] md:text-base md:font-normal">
              {t('Смотреть все туры')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourOffersSection;
