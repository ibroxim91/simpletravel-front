'use client';

import Rating from '@mui/material/Rating';
import { useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/shared/ui/carousel';
import httpClient from '@/shared/config/api/httpClient';
import { GET_TICKET_COMMENTS } from '@/shared/config/api/URLs';
import { TicketComment, TicketCommentListResponse } from '@/widgets/singletour/lib/data';

const DEMO_TICKET_ID = 1; // Demo ticket ID for home page comments

export interface HomeCommentResponse {
  status: boolean;
  data: {
    links: {
      previous: string | null;
      next: string | null;
    };
    total_items: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    results: TicketComment[];
  };
}

const HomeCommentTour = () => {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery<
    AxiosResponse<TicketCommentListResponse>
  >({
    queryKey: ['home-ticket-comments', page],
    queryFn: () =>
      httpClient.get(`${GET_TICKET_COMMENTS}?ticket=${DEMO_TICKET_ID}&page=${page}`),
    staleTime: 1000 * 60 * 5,
  });

  const comments: TicketComment[] = commentsData?.data?.data?.results ?? [];
  const totalComments = commentsData?.data?.data?.total_items ?? comments.length;
  const totalPages = commentsData?.data?.data?.total_pages ?? 1;
  const currentPage = commentsData?.data?.data?.current_page ?? page;

  // Calculate average rating
  const averageRating =
    totalComments > 0
      ? comments.reduce((sum, c) => sum + Number(c.rating || 0), 0) / totalComments
      : 0;

 const slidesCount = Math.max(
  1,
  Math.ceil(comments.length / (isMobile ? 1 : 2))
);

  return (
    <section className="custom-container">
      <div className="mx-auto w-full max-w-[353px] rounded-[14px] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:max-w-[1240px] md:p-6">
        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-bold leading-[32px] text-[#1C1C1E] md:text-[32px] md:leading-[44px]">
            {t('Отзывы нашых клиентов')}
          </p>
        </div>

        <div className="mt-6">
          {/* <div className="flex items-center gap-4 max-md:flex-wrap">
            <p className="text-[48px] leading-[59px] font-bold text-[#112211]">
              {Number(averageRating || 0).toFixed(1)}
            </p>
            <div className="flex flex-col items-start gap-2">
              <p className="text-[14px] leading-[17px] font-normal text-[#112211]">
                {totalComments} {t('отзывов')}
              </p>
            </div>
          </div> */}

          <div className="h-px w-full bg-[#11221140] mt-6" />

          <div className="flex w-full flex-col items-start gap-6 mt-6">
        <div className="w-full">
          {isCommentsLoading ? (
            <div className="flex h-60 w-full items-center justify-center text-[#6B7280]">
              {t('Загрузка отзывов...')}
            </div>
          ) : comments.length > 0 ? (
            <div className="relative">
              <Carousel
                opts={{ align: 'start', containScroll: 'trimSnaps', loop: true }}
              >
                <CarouselContent className="px-0">
                  {Array.from({ length: slidesCount }).map((_, slideIdx) => (
                    <CarouselItem key={slideIdx}>
                      <div className="flex gap-6">
                       {comments
                        .slice(
                        slideIdx * (isMobile ? 1 : 3),
                        slideIdx * (isMobile ? 1 : 3) + (isMobile ? 1 : 3)
                        ).map((item, idx) => {
                                            const it: any = item;
                            const username =
                              it.username || it.user?.username || 'UF';
                            const initials = (username as string)
                              .split(' ')
                              .slice(0, 2)
                              .map((v: string) => v[0] || '')
                              .join('')
                              .toUpperCase();

                            return (
                              <div
                                key={`${username}-${idx}`}
                                className="md:w-1/2 w-full rounded-xl border p-4 bg-white max-md:w-full min-h-[200px]"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] text-[14px] font-semibold text-[#112211] overflow-hidden">
                                    {it.image ? (
                                      <img
                                        src={it.image}
                                        alt={username}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      initials
                                    )}
                                  </div>
                                  <div className="flex flex-1 flex-col items-start gap-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-[16px] leading-5 font-semibold text-[#112211]">
                                        {Number(item.rating || 0).toFixed(1)}{' '}
                                        {/* {t('Превосходно')} */}
                                      </p>
                                      <span className="text-[16px] leading-5 font-normal text-[#112211]">
                                        |
                                      </span>
                                      <p className="text-[16px] leading-5 font-semibold text-[#112211]">
                                        {username}
                                      </p>
                                    </div>
                                    <p className="mt-2 break-words text-[14px] leading-[17px] font-normal text-[#112211]">
                                      {item.text}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {/* <div className="flex items-center justify-center gap-4 pt-5">
                <p className="text-sm font-medium text-[#1C1C1E]">
                  {t('Страница')} {currentPage} / {totalPages}
                </p>
              </div> */}
            </div>
          ) : (
            <div className="flex h-60 w-full items-center justify-center text-[#6B7280]">
              {t('Отзывов пока нет')}
            </div>
          )}
        </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 pt-6">
              <div className="flex items-center gap-4">
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
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
};

export default HomeCommentTour;
