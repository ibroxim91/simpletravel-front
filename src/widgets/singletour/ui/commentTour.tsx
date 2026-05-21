'use client';


import Rating from '@mui/material/Rating';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { ChevronLeft, ChevronRight, Flag, Send, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TicketsDetailAPi } from '../lib/api';
import { TicketComment, TicketCommentListResponse, ToursDetailData } from '../lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/shared/ui/carousel';
import { User_Api } from '@/features/profile/lib/api';
import { useRouter } from 'next/navigation';




const CommentTour = ({ data }: { data: ToursDetailData }) => {
  const t = useTranslations();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [page, setPage] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: userData } = useQuery({
    queryKey: ['get_me'],
    queryFn: () => User_Api.getMe(),
    staleTime: 1000 * 60 * 5,
  });

  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // Tailwind sm breakpoint
  };

  handleResize(); // birinchi renderda chaqirish
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const { data: commentsData, isLoading: isCommentsLoading } = useQuery<
    AxiosResponse<TicketCommentListResponse>
  >({
    queryKey: ['ticket-comments', data.id, page],
    queryFn: () => TicketsDetailAPi.getTicketComments({ ticketId: data.id, page }),
    enabled: Boolean(data.id),
  });

  const comments: TicketComment[] = commentsData?.data?.data?.results ?? [];
  const totalComments = commentsData?.data?.data?.total_items ?? comments.length;
  const totalPages = commentsData?.data?.data?.total_pages ?? 1;
  const currentPage = commentsData?.data?.data?.current_page ?? page;


// Agar commentlar bo‘lsa, ularning ratinglarini yig‘ib o‘rtacha chiqaramiz
const averageRating =
  totalComments > 0
    ? comments.reduce((sum, c) => sum + Number(c.rating || 0), 0) / totalComments
    : 0;
  useEffect(() => {
    setCarouselIndex(0);
  }, [currentPage, comments.length]);

  const slidesCount = Math.max(1, Math.ceil(comments.length / 2));

  const { mutate } = useMutation({
    mutationFn: (body: { text: string; rating: number; ticket: number }) =>
      TicketsDetailAPi.sendCommet(body),
    onSuccess: () => {
      toast.success('Fikr bildirganiz uchun rahmat', {
        position: 'top-center',
        richColors: true,
      });
      setRating(0);
      setComment('');
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['ticket-comments', data.id] });
    },
    onError: () => {
      toast.error('Xatolik yuz berdi', {
        position: 'top-center',
        richColors: true,
      });
    },
  });

  return (
    <div className="flex w-full max-w-[1240px] flex-col items-start gap-6 max-lg:gap-8">
      <div className="flex h-12 w-full items-center justify-between gap-6">
        <h3 className="text-[20px] leading-6 font-bold text-[#112211]">{t('Отзывы')}</h3>
      </div>

      <div className="flex items-center gap-4 max-md:flex-wrap">
        {/* <p className="text-[48px] leading-[59px] font-bold text-[#112211]">
          {Number(averageRating || 0).toFixed(1)}
        </p> */}
        <div className="flex flex-col items-start gap-2">
          {/* <p className="text-[20px] leading-6 font-semibold text-[#112211]">{t('Очень хорошо')}</p> */}
          <p className="text-[14px] leading-[17px] font-normal text-[#112211]">
            {totalComments} {t('отзывов')}
          </p>
        </div>
      </div>

      <div className="h-px w-full bg-[#11221140]" />

      {showForm ? (
        <div className="w-full rounded-[14px] border border-[#11221126] p-6">
          <div className="mx-auto max-w-full">
            <h3 className="mb-8 text-center text-3xl font-bold text-[#232325]">
              {t('Sizning fikringiz')}
            </h3>

            <div className="space-y-8">
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full p-2 text-[#6B7280] hover:bg-[#F3F4F6]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="rounded-xl bg-white p-6">
                <label className="text-[#232325] font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A73E8] text-sm text-white">
                    1
                  </span>
                  {t('Reytingni tanlang')}
                </label>
                <div className="flex gap-2 items-center justify-center py-4">
                  <Rating
                    name="tour-rating"
                    onChange={(__, newValue) => {
                      setRating(newValue || 0);
                    }}
                    value={rating}
                    size="large"
                    sx={{
                      color: '#F08125',
                      '& .MuiRating-iconEmpty': {
                        color: '#E0E0E0',
                      },
                    }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white p-6">
                <label className="text-[#232325] font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A73E8] text-sm text-white">
                    2
                  </span>
                  {t('Izohingizni yozing')}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("Sayohat haqida fikringizni baham ko'ring")}
                  className="w-full h-40 p-5 border-2 border-[#E0E0E0] text-[#232325] rounded-xl focus:border-[#084FE3] focus:outline-none resize-none transition-all duration-300 bg-white/80 placeholder:text-gray-400"
                />
              </div>

              <button
                disabled={!rating || !comment.trim()}
                onClick={() => {
                  mutate({
                    rating: rating,
                    text: comment,
                    ticket: data.id,
                  });
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#1A73E8] py-5 text-lg font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={24} />
                {t('Yuborish')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-start gap-6">
          <div className="w-full">
            {isCommentsLoading ? (
              <div className="flex h-60 w-full items-center justify-center text-[#6B7280]">
                {t('Загрузка отзывов...')}
              </div>
            ) : comments.length > 0 ? (
              <div className="relative">
               <Carousel opts={{ align: 'start', containScroll: 'trimSnaps', loop: true }}>

                  <CarouselContent className="px-0">
                    {Array.from({ length: slidesCount }).map((_, slideIdx) => (
                      <CarouselItem key={slideIdx}>
                        <div className="flex gap-6">
                          

                          {comments.slice(slideIdx * (isMobile ? 1 : 2), slideIdx * (isMobile ? 1 : 2) + (isMobile ? 1 : 2)).map((item, idx) => {
                            const it: any = item;
                            const username = it.username || it.user?.username || 'UF';
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
                                        {Number(item.rating || 0).toFixed(1)} 
                                        {/* {t('Превосходно')} */}
                                      </p>
                                      <span className="text-[16px] leading-5 font-normal text-[#112211]">|</span>
                                      <p className="text-[16px] leading-5 font-semibold text-[#112211]">{username}</p>
                                    </div>
                                    <p className="mt-2 break-words text-[14px] leading-[17px] font-normal text-[#112211]">{item.text}</p>
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

                <div className="flex items-center justify-center gap-4 pt-5">
                  <p className="text-sm font-medium text-[#1C1C1E]">
                    {t('Страница')} {currentPage} / {totalPages}
                  </p>
                </div>
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

          <div className="mt-12 mb-16 flex w-full justify-center">
            <button
              type="button"
              onClick={() => {
                const isAuth = Boolean(userData && userData.data && userData.data.data);
                if (!isAuth) {
                  router.push('/auth/register');
                  return;
                }
                setShowForm(!showForm);
              }}
              disabled={!data.allow_comment}
              className={`h-12 w-full rounded-[16px] border px-4 text-[14px] leading-[17px] font-semibold ${
                data.allow_comment
                  ? 'cursor-pointer border-[#1A73E8] text-[#1A73E8]'
                  : 'cursor-not-allowed border-gray-300 text-gray-400'
              }`}
            >
              {showForm ? t('Скрыть форму') : t('Оставить отзыв')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentTour;
