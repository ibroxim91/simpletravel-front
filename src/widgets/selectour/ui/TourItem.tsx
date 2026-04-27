import { BASE_URL } from '@/shared/config/api/URLs';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Button } from '@/shared/ui/button';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { CalendarDays, Hotel, MapPin, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import Ticket_Api from '../lib/api';
import { TickectAllResults } from '../lib/types';

export default function TourItem({ data }: { data: TickectAllResults }) {
  const { locale } = useParams();
  const t = useTranslations();
  const route = useRouter();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ ticket }: { ticket: number }) => Ticket_Api.saveTickets({ ticket }),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['ticket_all'] });
      queryClient.refetchQueries({ queryKey: ['get_saved'] });
      queryClient.refetchQueries({ queryKey: ['tickets_detail'] });
    },
    onError() {
      route.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
    },
  });

  const { mutate: deletLike } = useMutation({
    mutationFn: ({ ticket }: { ticket: number }) => Ticket_Api.removeTickets({ id: ticket }),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['ticket_all'] });
      queryClient.refetchQueries({ queryKey: ['get_saved'] });
      queryClient.refetchQueries({ queryKey: ['tickets_detail'] });
    },
    onError(error: { message: string }) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.message,
        position: 'bottom-right',
      });
    },
  });

  function saveQueryParamsToLocalStorage() {
    const url = window.location.href;
    const queryString = url.split('?')[1];
    if (!queryString) return;

    const params = new URLSearchParams(queryString);
    const keys = [
      { key: 'hotel_id', storageKey: 'hotel_id' },
      { key: 'town', storageKey: 'town' },
      { key: 'meal', storageKey: 'mealPlan' },
      { key: 'duration', storageKey: 'duration' },
      { key: 'rating', storageKey: 'rating' },
      { key: 'page', storageKey: 'page' },
    ];

    keys.forEach(({ key, storageKey }) => {
      const value = params.get(key);
      if (value) localStorage.setItem(storageKey, value);
      else localStorage.removeItem(storageKey);
    });

    let savedData = localStorage.getItem('filterTours');
    const from_cache = params.get('from_cache');

    try {
      savedData = savedData ? JSON.parse(savedData) : { init: true };
    } catch {
      savedData = { init: true };
    }

    if (from_cache) {
      (savedData as Record<string, string>).from_cache = from_cache;
      localStorage.setItem('filterTours', JSON.stringify(savedData));
    }
  }

  return (
    <Link
      href={`/selectour/${data?.slug}?from_cache=${data?.from_cache}`}
      onClick={() => {
        localStorage.setItem('tourOperator', data?.operator ?? '');
        localStorage.setItem('tourOperatorId', String(data?.tour_operator_id ?? ''));
        localStorage.setItem('from_cache', String(data?.from_cache));
        saveQueryParamsToLocalStorage();
      }}
      prefetch
    >
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        viewport={{ once: false, amount: 0.1 }}
        className="relative flex h-[296.5px] w-full overflow-hidden rounded-[12px] bg-white shadow-[0_4px_16px_rgba(17,34,17,0.05)] max-lg:h-auto max-lg:flex-col"
      >
        <div className="relative h-full w-[297px] shrink-0 max-lg:h-[240px] max-lg:w-full">
          <Image
            src={BASE_URL + data.ticket_images}
            alt={data.title}
            className="h-full w-full object-cover"
            width={297}
            height={297}
            quality={100}
          />
          <div className="absolute right-2 top-2 rounded-lg bg-white/50 px-4 py-2 text-xs font-medium leading-4 text-[#112211] backdrop-blur-[2px]">
            {`${Math.max(data.badge?.length || 0, 10)} ${t('фото')}`}
          </div>
        </div>

        <div className="flex h-full w-[627px] flex-col gap-6 bg-white px-6 pb-6 pt-6 max-lg:w-full">
          <div className="flex items-start justify-between gap-6">
            <div className="flex w-[386px] flex-col gap-4 max-lg:w-full">
              <h1 className="text-[20px] font-bold leading-6 text-[#1C1C1E]">{data.title}</h1>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MapPin color="#1A73E8" className="size-6" />
                  <p className="text-sm font-medium leading-[17px] text-[#6B7280]/80">
                    {data.destination?.name}
                  </p>
                </div>
                {data.ticket_hotel.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Hotel color="#1A73E8" className="size-6" />
                    <p className="line-clamp-1 text-sm font-medium leading-[17px] text-[#6B7280]/80">
                      {data.ticket_hotel[0].name}
                    </p>
                  </div>
                )}
                {data.ticket_hotel.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star color="#1A73E8" className="size-6" />
                    <p className="text-sm font-semibold leading-[17px] text-[#1C1C1E]">
                      {/^\d/.test(String(data.ticket_hotel[0].rating))
                        ? `${data.ticket_hotel[0].rating} ${t('звёзды')}`
                        : data.ticket_hotel[0].rating}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarDays color="#1A73E8" className="size-6" />
                  <p className="text-sm font-semibold leading-[17px] text-[#1C1C1E]">
                    {data.ticket_hotel[0]?.meal_plan || 'BB'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-[153px] flex-col items-end">
              <p className="text-right text-sm font-medium leading-[17px] text-[#6B7280]/75 line-through">
                {formatPrice(data.price * 1.1, locale as LanguageRoutes, true)}
              </p>
              <p className="text-right text-2xl font-bold leading-[29px] text-[#FF6B00]">
                {formatPrice(data.price, locale as LanguageRoutes, true)}
              </p>
              <p className="text-right text-xs font-medium leading-[15px] text-[#6B7280]/75">
                {t('с учетом налогов')}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-[rgba(17,34,17,0.25)]/25" />

          <div className="flex items-center gap-4">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (data.is_liked) deletLike({ ticket: data.id });
                else mutate({ ticket: data.id });
              }}
              className={clsx(
                'h-12 w-12 cursor-pointer rounded-full border shadow-[0_0_4px_rgba(0,0,0,0.15)]',
                data.is_liked
                  ? 'border-[#E0313733] bg-[#FFE4E5] hover:bg-[#FFE4E5]'
                  : 'border-[#DFDFDF] bg-white hover:bg-white',
              )}
            >
              <FavoriteRoundedIcon sx={{ color: '#E03137', fontSize: 20 }} />
            </Button>

            <button className="flex h-12 w-[434px] items-center justify-center rounded-[14px] bg-[#1A73E8] text-sm font-semibold leading-[17px] text-white">
              {t('Смотреть тур')}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
