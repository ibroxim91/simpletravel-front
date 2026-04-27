'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import { useQuery } from '@tanstack/react-query';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import DestinationCard from './cards/DestinationCard';

const Populardestinations = () => {
  const { locale } = useParams();
  const t = useTranslations();
  const autoplay = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket_home_popular'],
    queryFn: () =>
      Ticket_Api.GetHomeTickets(),
    select(data) {
      return data.data.results.tickets;
    },
  });
  const popular = ticket?.slice(0, 8) ?? [];

  return (
    <section className="custom-container">
      <div className="mx-auto w-full max-w-[1240px] rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:p-6 xl:min-h-[850px]">
        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-bold leading-[32px] text-[#1C1C1E] md:text-[32px] md:leading-[44px]">
            {t('Популярные направления')}
          </p>
          <p className="text-sm font-medium leading-5 text-[#6B7280] md:text-base md:leading-[22px]">
            {t('Места, в которые влюбляются')}
          </p>
        </div>

        <div className="mt-6 hidden xl:grid xl:grid-cols-4 xl:gap-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={idx} className="h-[340px] rounded-[14px]" />
              ))
            : popular.map((item: any, index: number) => (
                <DestinationCard
                  key={item.id}
                  item={item}
                  index={index}
                  locale={locale as LanguageRoutes}
                  fromLabel={t('от')}
                  onClick={() => {
                    localStorage.setItem('tourOperator', item?.operator ?? '');
                    localStorage.setItem(
                      'tourOperatorId',
                      String(item?.tour_operator_id ?? ''),
                    );
                    localStorage.setItem('from_cache', String(item?.from_cache ?? ''));
                  }}
                />
              ))}
        </div>

        <div className="mt-6 xl:hidden">
          <Carousel
            opts={{ align: 'start', loop: false, containScroll: 'trimSnaps' }}
            plugins={[autoplay.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {(isLoading ? Array.from({ length: 8 }) : popular).map((item: any, index: number) => (
                <CarouselItem
                  key={isLoading ? `skeleton-${index}` : item.id}
                  className="pl-3 basis-[88%] md:basis-[48%]"
                >
                  {isLoading ? (
                    <Skeleton className="h-[340px] rounded-[14px]" />
                  ) : (
                    <DestinationCard
                      item={item}
                      index={index}
                      locale={locale as LanguageRoutes}
                      fromLabel={t('от')}
                      onClick={() => {
                        localStorage.setItem('tourOperator', item?.operator ?? '');
                        localStorage.setItem(
                          'tourOperatorId',
                          String(item?.tour_operator_id ?? ''),
                        );
                        localStorage.setItem('from_cache', String(item?.from_cache ?? ''));
                      }}
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Populardestinations;
