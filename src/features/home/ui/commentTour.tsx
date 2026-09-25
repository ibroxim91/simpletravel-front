'use client';

import httpClient from '@/shared/config/api/httpClient';
import { GET_TICKET_COMMENTS } from '@/shared/config/api/URLs';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import { TicketComment, TicketCommentListResponse } from '@/widgets/singletour/lib/data';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import Rating from '@mui/material/Rating';
import { useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const DEMO_TICKET_ID = 1;
const NO_USER_AVATAR = '/images/no-user.svg';
const MONTH_KEYS = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
] as const;

function formatTravelDate(
  value: string | null | undefined,
  t: (key: (typeof MONTH_KEYS)[number]) => string,
) {
  if (!value) return '';
  const match = /^(\d{4})-(\d{2})/.exec(value);
  if (!match) return '';
  const monthKey = MONTH_KEYS[Number(match[2]) - 1];
  if (!monthKey) return '';
  return `${t(monthKey)} ${match[1]}`;
}

const HomeCommentTour = () => {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery<
    AxiosResponse<TicketCommentListResponse>
  >({
    queryKey: ['home-ticket-comments', page],
    queryFn: () =>
      httpClient.get(`${GET_TICKET_COMMENTS}?ticket=${DEMO_TICKET_ID}&page=${page}`),
    staleTime: 1000 * 60 * 5,
  });

  const comments: TicketComment[] = commentsData?.data?.data?.results ?? [];
  const totalPages = commentsData?.data?.data?.total_pages ?? 1;
  const currentPage = commentsData?.data?.data?.current_page ?? page;

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
    };
  }, [carouselApi]);

  return (
    <section>
      <div className="custom-container">
        <div className="mx-auto w-full max-w-[353px] rounded-[14px] bg-white px-4 pb-4 pt-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:max-w-[1240px] md:px-6 md:pb-6 md:pt-6 md:shadow-[0_2px_20px_rgba(0,0,0,0.15)]">
          <div className="flex w-full items-start justify-between gap-2 md:items-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-[20px] font-bold leading-6 text-[#1C1C1E] md:text-[32px] md:leading-[44px]">
                {t('Отзывы наших клиентов')}
              </h2>
              <p className="text-[14px] font-normal leading-[17px] text-[#6B7280] md:text-base md:leading-[22px]">
                {t('reviews_subtitle')}
              </p>
            </div>
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

          <div className="mt-6">
            {isCommentsLoading ? (
              <div className="flex h-60 w-full items-center justify-center text-[#6B7280]">
                {t('Загрузка отзывов...')}
              </div>
            ) : comments.length > 0 ? (
              <Carousel
                setApi={setCarouselApi}
                opts={{ align: 'start', containScroll: 'trimSnaps', loop: false }}
                className="w-full"
              >
                <CarouselContent className="-ml-3">
                  {comments.map((item, index) => {
                    const username = item.username || 'User';
                    const avatar = item.image?.trim() ? item.image : NO_USER_AVATAR;
                    const travelDate = formatTravelDate(item.travel_date, t);
                    const place = [item.location, item.destination].filter(Boolean).join(', ');

                    return (
                      <CarouselItem
                        key={`${username}-${index}`}
                        className="basis-full pl-3 md:basis-1/2 xl:basis-1/4"
                      >
                        <article className="flex h-full min-h-[220px] flex-col rounded-[16px] border border-[#E5E7EB] bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <img
                                src={avatar}
                                alt={username}
                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                              />
                              <p className="truncate text-[15px] font-bold leading-5 text-[#1C1C1E]">
                                {username}
                              </p>
                            </div>
                            <span className="text-[28px] leading-none text-[#1A73E8]/30">”</span>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <Rating
                              value={Number(item.rating || 0)}
                              precision={0.1}
                              readOnly
                              size="small"
                              sx={{ color: '#F5B400' }}
                            />
                            <span className="text-[14px] font-bold text-[#1C1C1E]">
                              {Number(item.rating || 0).toFixed(1)}
                            </span>
                          </div>

                          <p className="mt-3 flex-1 text-[14px] leading-5 text-[#1C1C1E]">
                            {item.text}
                          </p>

                          {(place || travelDate) && (
                            <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F3F4F6] pt-3 text-[12px] text-[#6B7280]">
                              {place ? (
                                <span className="flex min-w-0 items-center gap-1">
                                  <FmdGoodOutlinedIcon sx={{ fontSize: 16, color: '#1A73E8' }} />
                                  <span className="truncate">{place}</span>
                                </span>
                              ) : (
                                <span />
                              )}
                              {travelDate ? (
                                <span className="flex shrink-0 items-center gap-1">
                                  <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: '#1A73E8' }} />
                                  {travelDate}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </article>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            ) : (
              <div className="flex h-60 w-full items-center justify-center text-[#6B7280]">
                {t('Отзывов пока нет')}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                className="rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#1A73E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('Предыдущая')}
              </button>
              <p className="text-sm font-medium text-[#1C1C1E]">
                {t('Страница')} {currentPage} / {totalPages}
              </p>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
                className="rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-semibold text-[#1A73E8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('Следующая')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeCommentTour;
