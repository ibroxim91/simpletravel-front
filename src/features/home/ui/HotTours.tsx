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

const HotTours = () => {
  const t = useTranslations();
  const { locale }:any = useParams();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['home_tickets'],
    queryFn: () => Ticket_Api.GetHomeTickets(),
    select: (res) => res.data.results.tickets ?? [],
  });

  const hotTours = data?.slice(0, 4) ?? [];
  const carouselItems = isLoading ? Array.from({ length: 4 }) : hotTours;

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
    <section className="bg-transparent pb-8 pt-0">
      <div className="custom-container">
        <div className="mx-auto w-full max-w-[1240px] rounded-[14px] bg-white px-4 pb-6 pt-6 shadow-[0_2px_20px_rgba(0,0,0,0.15)] md:px-6 xl:h-[725px]">
          <div className="flex w-full flex-col gap-1 md:gap-2">
            <div className="flex w-full items-start justify-between gap-2 md:items-center">
              <h2 className="text-[24px] font-bold leading-[30px] text-[#1C1C1E] md:text-[32px] md:leading-[44px]">
                {t('Горящие туры: успейте забронировать!')}
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
            <p className="text-sm font-medium leading-5 text-[#6B7280] md:text-base md:leading-[22px]">
              {t('Лучшие направления по минимальным ценам')}
            </p>
          </div>

          <div className="mt-6">
            <Carousel
              setApi={setCarouselApi}
              opts={{ align: 'start', loop: false, containScroll: 'trimSnaps' }}
              className="w-full"
            >
              <CarouselContent className="-ml-3">
                {carouselItems.map((item: any, index: number) => (
                  <CarouselItem
                    key={isLoading ? `skeleton-${index}` : item.id}
                    className="pl-3 basis-[84%] md:basis-1/2 xl:basis-1/4"
                  >
                    {isLoading ? (
                      <div className="h-[483px] rounded-[14px] border border-[#E5E7EB] bg-white p-4">
                        <Skeleton className="h-[233px] w-full rounded-[14px]" />
                        <Skeleton className="mt-4 h-6 w-4/5" />
                        <Skeleton className="mt-2 h-4 w-14" />
                        <Skeleton className="mt-4 h-4 w-1/2" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                        <Skeleton className="mt-4 h-5 w-1/3" />
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

          <div className="mt-4 flex justify-center">
            <Button className="h-[60px] w-[292px] rounded-[14px] bg-[#E8F1FF] text-base font-normal text-[#1C1C1E] hover:bg-[#DCE8FF]">
              {t('Смотреть все туры')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotTours;
