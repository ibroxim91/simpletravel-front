'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import DestinationCard from './cards/DestinationCard';

const Populardestinations = () => {
  const params = useParams<{ locale: LanguageRoutes }>();
  const locale = params?.locale as LanguageRoutes;
  const t = useTranslations();
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
      <div className="mx-auto w-full max-w-[353px] rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:max-w-[1240px] md:p-6 xl:min-h-[850px]">
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

        <div className="mt-6 hidden grid-cols-3 gap-3 md:grid xl:hidden">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-[220px] rounded-[14px]" />
              ))
            : popular.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/selectour/${item.slug}/?from_cache=${item?.from_cache ?? ''}`}
                  className="relative h-[220px] w-full overflow-hidden rounded-[14px]"
                  onClick={() => {
                    localStorage.setItem('tourOperator', item?.operator ?? '');
                    localStorage.setItem('tourOperatorId', String(item?.tour_operator_id ?? ''));
                    localStorage.setItem('from_cache', String(item?.from_cache ?? ''));
                  }}
                >
                  <Image
                    src={BASE_URL + item.ticket_images}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="line-clamp-1 text-[20px] font-semibold leading-6 text-white">
                      {item.destination?.name || item.title}
                    </p>
                    <p className="mt-1 text-[12px] font-medium leading-[15px] text-white">
                      {t('от')} {formatPrice(item.price, locale as LanguageRoutes, true)}
                    </p>
                  </div>
                </Link>
              ))}
        </div>

        <div className="mt-6 overflow-x-auto md:hidden">
          <div className="grid w-max grid-flow-col grid-rows-2 gap-3 pr-2">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={idx} className="h-[200px] w-[157px] rounded-[14px]" />
              ))
            : popular.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/selectour/${item.slug}/?from_cache=${item?.from_cache ?? ''}`}
                  className="relative h-[200px] w-[157px] overflow-hidden rounded-[14px]"
                  onClick={() => {
                    localStorage.setItem('tourOperator', item?.operator ?? '');
                    localStorage.setItem('tourOperatorId', String(item?.tour_operator_id ?? ''));
                    localStorage.setItem('from_cache', String(item?.from_cache ?? ''));
                  }}
                >
                  <Image
                    src={BASE_URL + item.ticket_images}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="line-clamp-1 text-[20px] font-semibold leading-6 text-white">
                      {item.destination?.name || item.title}
                    </p>
                    <p className="mt-1 text-[12px] font-medium leading-[15px] text-white">
                      {t('от')} {formatPrice(item.price, locale as LanguageRoutes, true)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Populardestinations;
