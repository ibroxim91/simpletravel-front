import Rating from '@mui/material/Rating';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Flag, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { TicketsDetailAPi } from '../lib/api';
import { ToursDetailData } from '../lib/data';

const CommentTour = ({ data }: { data: ToursDetailData }) => {
  const t = useTranslations();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const fallbackComments = [
    {
      user: { id: 1, username: 'Имя Фамилия' },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      rating: 5,
    },
    {
      user: { id: 2, username: 'Имя Фамилия' },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      rating: 5,
    },
    {
      user: { id: 3, username: 'Имя Фамилия' },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      rating: 5,
    },
    {
      user: { id: 4, username: 'Имя Фамилия' },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      rating: 5,
    },
    {
      user: { id: 5, username: 'Имя Фамилия' },
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      rating: 5,
    },
  ];

  const comments = data.ticket_comments?.length > 0 ? data.ticket_comments : fallbackComments;
  const averageRating =
    data.ticket_comments?.length > 0
      ? data.ticket_comments.reduce((acc, item) => acc + Number(item.rating || 0), 0) /
        data.ticket_comments.length
      : 4.2;
  const totalComments = data.ticket_comments?.length > 0 ? data.ticket_comments.length : 37;

  const { mutate } = useMutation({
    mutationFn: (body: { text: string; rating: number; ticket: number }) =>
      TicketsDetailAPi.sendCommet(body),
    onSuccess: () => {
      toast.success('Fikr bildirganiz uchun rahmat', {
        position: 'top-center',
        richColors: true,
      });
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
        <h3 className="text-[20px] leading-6 font-bold text-[#112211]">{t('Отзывы о гостинице')}</h3>
      </div>

      <div className="flex items-center gap-4 max-md:flex-wrap">
        <p className="text-[48px] leading-[59px] font-bold text-[#112211]">
          {Number(averageRating || 0).toFixed(1)}
        </p>
        <div className="flex flex-col items-start gap-2">
          <p className="text-[20px] leading-6 font-semibold text-[#112211]">{t('Очень хорошо')}</p>
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
          {comments.slice(0, 5).map((item, index) => (
            <div key={`${item.user.id}-${index}`} className="w-full">
              <div className="flex w-full items-start gap-4 max-md:flex-col">
                <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] text-[14px] font-semibold text-[#112211]">
                  {(item.user.username || 'UF')
                    .split(' ')
                    .slice(0, 2)
                    .map((v) => v[0] || '')
                    .join('')
                    .toUpperCase()}
                </div>

                <div className="flex flex-1 flex-col items-start gap-2">
                  <div className="flex items-center gap-2 max-md:flex-wrap">
                    <p className="text-[16px] leading-5 font-semibold text-[#112211]">
                      {Number(item.rating || 0).toFixed(1)} {t('Превосходно')}
                    </p>
                    <span className="text-[16px] leading-5 font-normal text-[#112211]">|</span>
                    <p className="text-[16px] leading-5 font-normal text-[#112211]">
                      {item.user.username || t('Имя Фамилия')}
                    </p>
                  </div>
                  <p className="break-words text-[14px] leading-[17px] font-normal text-[#112211]">
                    {item.text}
                  </p>
                </div>

                <Flag className="mt-0.5 h-5 w-5 shrink-0 text-[#112211BF] max-md:self-end" />
              </div>

              {index !== Math.min(comments.length, 5) - 1 && (
                <div className="mt-6 h-px w-full bg-[#11221140]" />
              )}
            </div>
          ))}

          <div className="flex w-full items-center justify-center gap-6">
            <button type="button" className="cursor-pointer text-[#6B7280]">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <p className="text-[16px] leading-5 font-medium text-[#1C1C1E]">1 из 9</p>
            <button type="button" className="cursor-pointer text-[#6B7280]">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-12 mb-16 flex w-full justify-center">
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
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
