'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import { useQuery } from '@tanstack/react-query';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import TourOfferCard from './cards/TourOfferCard';

const VisaTours = () => {
  const t = useTranslations();
  const { locale } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['home_tickets_visa'],
    queryFn: () => Ticket_Api.GetHomeTickets(),
    select: (res) => res.data.results.tickets ?? [],
  });

  const visaTours = data?.slice(4, 8) ?? [];

  const renderCards = (items: any[]) => (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[483px] rounded-[14px] border border-[#E5E7EB] bg-white p-4">
              <Skeleton className="h-[233px] w-full rounded-[14px]" />
              <Skeleton className="mt-4 h-6 w-4/5" />
              <Skeleton className="mt-2 h-4 w-14" />
              <Skeleton className="mt-4 h-4 w-1/2" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-4 h-5 w-1/3" />
            </div>
          ))
        : items.map((item, index) => (
            <TourOfferCard
              key={item.id}
              item={item}
              index={index}
              locale={locale as LanguageRoutes}
              fallbackDurationText={t('9 дней')}
              fallbackHotelText={t('Отель hotels')}
              starsText={t('3 звездочный')}
              onClick={() => {
                localStorage.setItem('tourOperator', item?.operator ?? '');
                localStorage.setItem('from_cache', item?.from_cache ?? '');
                localStorage.setItem(
                  'tourOperatorId',
                  String(item?.tour_operator_id ?? ''),
                );
              }}
            />
          ))}
    </div>
  );

  return (
    <section className="bg-transparent pb-0 pt-0">
      <div className="custom-container">
        <div className="mx-auto w-full max-w-[1078px] rounded-[14px] bg-white px-4 pb-6 pt-6 shadow-[0_2px_20px_rgba(0,0,0,0.15)] md:px-6 xl:h-[725px]">
          <div className="flex h-[74px] w-full flex-col gap-2">
            <div className="flex h-[44px] w-full items-center justify-between">
              <h2 className="text-[32px] font-bold leading-[44px] text-[#1C1C1E]">
                {t('Виза не нужна')}
              </h2>
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  aria-label="prev"
                  className="grid h-9 w-9 place-items-center rounded-[20px] bg-[#E5E7EB]/70 text-[#6B7280]"
                >
                  <KeyboardBackspaceIcon sx={{ fontSize: 18 }} />
                </button>
                <button
                  type="button"
                  aria-label="next"
                  className="grid h-9 w-9 place-items-center rounded-[20px] bg-[#E5E7EB] text-black"
                >
                  <KeyboardBackspaceIcon sx={{ fontSize: 18, transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </div>
            <p className="text-base font-medium leading-[22px] text-[#6B7280]">
              {t('Путешествуйте без лишних хлопот')}
            </p>
          </div>

          <div className="mt-6">
            {renderCards(visaTours)}
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

export default VisaTours;
