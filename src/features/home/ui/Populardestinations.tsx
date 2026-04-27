'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import DestinationCard from './cards/DestinationCard';

const Populardestinations = () => {
  const { locale } = useParams();
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
    <section className="custom-container max-lg:hidden">
      <div className="mx-auto h-[850px] w-full max-w-[1078px] rounded-[14px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
        <div className="flex h-[74px] flex-col gap-2">
          <p className="text-[32px] font-bold leading-[44px] text-[#1C1C1E]">
            {t('Популярные направления')}
          </p>
          <p className="text-base font-medium leading-[22px] text-[#6B7280]">
            {t('Места, в которые влюбляются')}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
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
      </div>
    </section>
  );
};

export default Populardestinations;
