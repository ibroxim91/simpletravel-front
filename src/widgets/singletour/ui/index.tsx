'use client';

import { User_Api } from '@/features/profile/lib/api';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Button } from '@/shared/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import Swiper from '@/shared/ui/swiper';
import Ticket_Api from '@/widgets/selectour/lib/api';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import EastIcon from '@mui/icons-material/East';
import ErrorIcon from '@mui/icons-material/Error';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import TimelapseOutlinedIcon from '@mui/icons-material/TimelapseOutlined';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Rating from '@mui/material/Rating';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Copy, Hourglass, Scroll } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import 'swiper/css';
import Hotel2 from '../../../../public/images/hotel2.png';
import Hotel3 from '../../../../public/images/hotel3.png';
import Hotel4 from '../../../../public/images/hotel4.png';
import Hotel_MEAL from '../../../../public/images/hotel_meal.png';
import Hotel1 from '../../../../public/images/hotel_name.png';
import Hotel_Star from '../../../../public/images/hotel_star.png';
import Statue from '../../../../public/images/statue.png';
import { TicketsDetailAPi } from '../lib/api';
import HotelInfoItem from './HotelInfoItem';
import TourDayItem from './TourDayItem';
import TourDetailLoading from './TourDetailLoading';
import TourFoodItem from './TourFoodItem';
import TourOffersItem from './TourOffersItem';
import WantHelpModal from './WantHelpModal';
import WatchTour from './WatchTour';
import CommentTour from './commentTour';


const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideIn = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

export default function SingleTour() {
  const t = useTranslations();
  const route = useRouter();
  const { tourid, locale } = useParams();
  const tourOperatorId =
    typeof window !== 'undefined' ? localStorage.getItem('tourOperatorId') : null;
 const idFromSlug = Array.isArray(tourid)
    ? Number(tourid[tourid.length - 1].split('-').pop())
    : tourid
      ? Number(tourid.split('-').pop())
      : undefined;

  const formatShortDate = (value?: string) => {
    if (!value) return '--.--.--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--.--.--';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['tickets_detail', tourOperatorId],
    queryFn: () =>
      TicketsDetailAPi.getTicketsDetail({ id: String(tourOperatorId) }),
    select(data) {
      console.log("data.data.data ",data.data.data)
      localStorage.setItem("tour", JSON.stringify(data.data.data));
      return data.data.data;
    },
     enabled: !!tourOperatorId, // faqat ID mavjud bo‘lsa ishlaydi
    staleTime: 0,              // har safar yangi fetch
    cacheTime: 0,
  });

  
  const { data: hotTicket } = useQuery({
    queryKey: ['ticket_hot'],
    queryFn: () =>
      Ticket_Api.GetAllTickets({
        params: {
          page: 1,
          page_size: 8,
          rating: 3.5,
        },
      }),
    enabled: !!data,
  });
 

  const { data: user } = useQuery({
    queryKey: ['get_me'],
    queryFn: () => User_Api.getMe(),
  });
  const queryClient = useQueryClient();

  const { mutate: addLike } = useMutation({
    mutationFn: ({ ticket }: { ticket: number }) => Ticket_Api.saveTickets({ ticket }),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['ticket_all'] });
      queryClient.refetchQueries({ queryKey: ['get_saved'] });
      queryClient.refetchQueries({ queryKey: ['tickets_detail'] });
    },
    onError() {
      route.push(
        `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
      );
    },
  });

  const { mutate: removeLike } = useMutation({
    mutationFn: ({ ticket }: { ticket: number }) => Ticket_Api.removeTickets({ id: ticket }),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['ticket_all'] });
      queryClient.refetchQueries({ queryKey: ['get_saved'] });
      queryClient.refetchQueries({ queryKey: ['tickets_detail'] });
    },
  });

  const [openWatch, setOpenWatch] = useState<boolean>(false);
  const [openHelp, setOpenHelp] = useState<boolean>(false);
  const [openHelpMobile, setOpenHelpMobile] = useState<boolean>(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollNext(api.canScrollNext());
      setCanScrollPrev(api.canScrollPrev());
    };

    updateButtons();
    api.on('select', updateButtons);
  }, [api]);

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const STEP = 250;
  const originalLength = items.length;

  const [index, setIndex] = useState<number>(originalLength);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  const hotelSwiperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hotelSwiperRef.current) return;
    const x = -index * STEP;
    if (isAnimating) {
      hotelSwiperRef.current.style.transition = 'transform 300ms ease-in-out';
    } else {
      hotelSwiperRef.current.style.transition = 'none';
    }
    hotelSwiperRef.current.style.transform = `translateX(${x}px)`;
  }, [index, isAnimating]);

  useEffect(() => {
    if (!hotelSwiperRef.current) return;
    const el = hotelSwiperRef.current;
    const onEnd = () => {
      if (index < originalLength) {
        setIsAnimating(false);
        setIndex(index + originalLength);
      } else if (index >= originalLength * 2) {
        setIsAnimating(false);
        setIndex(index - originalLength);
      }
    };
    el.addEventListener('transitionend', onEnd);
    return () => {
      el.removeEventListener('transitionend', onEnd);
    };
  }, [index, originalLength]);

  useEffect(() => {
    if (!isAnimating) {
      const id = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isAnimating]);

  if (isLoading) {
    return <TourDetailLoading />;
  }

  const visibleIncludedServices = data?.ticket_included_services || [];
  const includedServicesToRender =
    visibleIncludedServices.length > 0
      ? visibleIncludedServices
      : [
          { image: Hotel1.src, title: t('Трансфер'), desc: t('Включено') },
          { image: Hotel1.src, title: t('Трансфер'), desc: t('Не включено') },
          { image: Hotel1.src, title: t('Трансфер'), desc: t('Не включено') },
        ];

  const amenitiesToRender =
    data?.ticket_amenities?.length > 0
      ? data.ticket_amenities
      : [
          { icon_name: 'Waves', name: t('Открытый бассейн') },
          { icon_name: 'Waves', name: t('Закрытый бассейн') },
          { icon_name: 'Flower2', name: t('Спа- и оздоровительный центр') },
          { icon_name: 'UtensilsCrossed', name: t('Ресторан') },
          { icon_name: 'Bell', name: t('Обслуживание номеров') },
          { icon_name: 'Dumbbell', name: t('Фитнес зал') },
          { icon_name: 'Wine', name: t('Бар') },
          { icon_name: 'Wifi', name: t('Бесплатный Wi Fi') },
          { icon_name: 'Coffee', name: t('Чай/Кофе машина') },
        ];


  return (
    <div className="bg-white pb-[72px]">
      <div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <WantHelpModal
              onClose={setOpenHelp}
              open={openHelp}
              id={data ? data.travel_agency_id : undefined}
              openHelpMobile={openHelpMobile}
              setOpenHelpMobile={setOpenHelpMobile}
            />
          </motion.div>
        </AnimatePresence>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full bg-gray-200" />
        ) : null}

        {openWatch && data && (
          <WatchTour
            onClose={() => setOpenWatch(false)}
            images={data.ticket_images}
          />
        )}
      </div>
      {data && (
        <>
          <div className="custom-container">
            <div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUp}
                className="pt-2 flex flex-col gap-6"
              >
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<EastIcon fontSize="small" className="text-[#112211]/70" />}
                  sx={{
                    '& .MuiBreadcrumbs-separator': {
                      mx: 1,
                    },
                  }}
                >
                  <Link href="/" className="text-[14px] text-[#FF6B00]">
                    {t('Главная')}
                  </Link>
                  <Link href="/selectour" className="text-[14px] text-[#FF6B00]">
                    {t('Подобрать тур')}
                  </Link>
                  <p className="text-[14px] text-[#112211]/70">{data.title}</p>
                </Breadcrumbs>

                <div className="flex items-end justify-between gap-8 max-lg:flex-col max-lg:items-start">
                  <div className="flex max-w-[684px] flex-col gap-6">
                    <div className="flex items-center gap-6 max-md:flex-col max-md:items-start max-md:gap-2">
                      <h1 className="text-[20px] leading-[24px] font-bold text-[#112211]">
                        {data.title}
                      </h1>
                      <div className="flex items-center gap-2">
                        <Rating
                          name="read-only"
                          size="small"
                          value={data.rating}
                          readOnly
                          sx={{ color: '#FF6B00' }}
                          precision={0.1}
                        />
                        <p className="text-[14px] font-medium text-[#112211]">
                          {Math.round(data.rating || 0)} {t('звездочный отель')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 20 }} />
                        <p className="text-[14px] font-medium text-[#112211]/75">
                          {data.destination?.name}
                        </p>
                        <span className="rounded-[14px] bg-[#F59E0B] px-3 py-1 text-[14px] font-medium text-[#1C1C1E]/75">
                          {t('Необходима Виза')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HotelOutlinedIcon sx={{ color: '#1A73E8', fontSize: 20 }} />
                        <p className="text-[14px] font-medium text-[#112211]/75">
                          {t('Отель')} {data.ticket_hotel?.[0]?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full max-w-[301px] flex-col items-end gap-4 max-lg:items-start">
                    <h1 className="text-right text-[24px] leading-[29px] max-lg:text-left font-bold text-[#1C1C1E]">
                      {formatPrice(data.price, locale as LanguageRoutes, true)} /{' '}
                      <span className="text-[24px] font-normal">
                        1 {t('человек')}
                      </span>
                    </h1>
                    <div className="flex items-center gap-6">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (data.is_liked) {
                            removeLike({ ticket: data.id });
                          } else {
                            addLike({ ticket: data.id });
                          }
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]"
                      >
                        <FavoriteRoundedIcon
                          sx={{ color: data.is_liked ? '#E03137' : '#9CA3AF', fontSize: 20 }}
                        />
                      </button>
                      {user ? (
                        <Link href={`/booking/${data.id}`}>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="h-12 w-[186px] rounded-[16px] bg-[#FF6B00] px-4 text-[14px] font-semibold text-white"
                          >
                            {t('Забронировать')}
                          </motion.button>
                        </Link>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            route.push(
                              `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                            );
                          }}
                          className="h-12 w-[186px] rounded-[16px] bg-[#FF6B00] px-4 text-[14px] font-semibold text-white"
                        >
                          {t('Забронировать')}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUp}
                className="mt-4"
              >
                <Swiper
                  id={data.id}
                  is_liked={data.is_liked}
                  images={data.ticket_images}
                  setOpenWatch={setOpenWatch}
                />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUp}
                className="hidden"
              />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUp}
                className="hidden items-center gap-4 mt-5 max-lg:flex-col"
              >
                {user ? (
                  <Link href={`/booking/${data.id}`} className="max-lg:w-full">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#1764FC] rounded-[43px] px-[70px] py-[14px] text-white cursor-pointer text-sm max-lg:w-full"
                    >
                      {t('Забронировать')}
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      route.push(
                        `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
                      );
                    }}
                    className="bg-[#1764FC] rounded-[43px] px-[70px] py-[14px] text-white cursor-pointer text-sm max-lg:w-full"
                  >
                    {t('Забронировать')}
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpenHelp(true)}
                  className="flex items-center max-lg:hidden justify-center gap-[10px] bg-[#ECF2FF] px-[70px] py-[14px] text-[#084FE3] max-lg:w-full shadow-sm cursor-pointer text-sm rounded-[43px]"
                >
                  <ErrorIcon />
                  <p>{t('Нужна помощь?')}</p>
                </motion.button>
                <button
                  onClick={() => {
                    setOpenHelpMobile(true);
                  }}
                  className="flex items-center lg:hidden justify-center gap-[10px] bg-[#ECF2FF] px-[70px] py-[14px] text-[#084FE3] max-lg:w-full shadow-sm cursor-pointer text-sm rounded-[43px]"
                >
                  <ErrorIcon />
                  <p>{t('Нужна помощь?')}</p>
                </button>
              </motion.div>

              <hr className="mt-[60px]" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                // variants={slideIn}
                className="mt-[72px] mb-[72px] flex w-full max-w-[1240px] flex-col gap-8 h-[342px] max-xl:h-auto"
              >
                <div className="flex w-full h-[165px] flex-col items-start gap-4 max-lg:h-auto">
                  <h1 className="text-[24px] leading-[29px] font-bold text-[#1C1C1E]">
                    {t('Описание отеля')} {data.ticket_hotel?.[0]?.name}
                  </h1>
                  <p className="w-full h-[120px] overflow-hidden text-[16px] leading-5 font-medium text-[#1C1C1E]/75">
                    {data.hotel_info}
                  </p>
                </div>
                <div className="flex w-full h-[145px] items-start gap-6 overflow-visible max-xl:h-auto max-xl:flex-wrap">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="h-[145px] w-[187px] shrink-0 rounded-[12px] bg-[#1A73E8] p-4"
                  >
                    <div className="flex h-full flex-col justify-between">
                      <p className="text-[32px] leading-10 font-bold text-white">
                        {Number(data.rating || 0).toFixed(1)}
                      </p>
                      <div className="flex flex-col gap-1">
                        <p className="text-[16px] leading-5 font-bold text-white">
                          {t('Очень хорошо')}
                        </p>
                        <p className="text-[14px] leading-[17px] font-medium text-white">
                          {data.ticket_comments?.length || 0} {t('отзывов')}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {[
                    {
                      id: 'hotel-type',
                      img: Hotel_Star,
                      name: t('Тип отеля'),
                      title: `${data.ticket_hotel?.[0]?.rating || '-'} ${t('звездочный')}`,
                      iconNode: <StarBorderRoundedIcon sx={{ color: '#1A73E8', fontSize: 24 }} />,
                    },
                    {
                      id: 'meal',
                      img: Hotel_MEAL,
                      name: t('Питание'),
                      title: (() => {
                        const meal = data.ticket_hotel?.[0]?.meal_plan;
                        const mealMap: Record<string, string> = {
                          full_board: t('Полный пансион'),
                          breakfast: t('Завтрак'),
                          half_board: t('Полупансион'),
                          all_inclusive: t('Все включено'),
                          room_only: t('Без питания'),
                        };
                        return mealMap[meal] || t('Все включено');
                      })(),
                      iconNode: <LocalCafeOutlinedIcon sx={{ color: '#1A73E8', fontSize: 24 }} />,
                    },
                    {
                      id: 'duration',
                      img: Hotel2,
                      name: t('Длительность'),
                      title: `${data.duration_days} ${t('дней')}`,
                      iconNode: <TimelapseOutlinedIcon sx={{ color: '#1A73E8', fontSize: 24 }} />,
                    },
                    {
                      id: 'group_size',
                      img: Hotel3,
                      name: t('Количество'),
                      title: `${data.passenger_count} ${t('человек')}`,
                      iconNode: <Groups2OutlinedIcon sx={{ color: '#1A73E8', fontSize: 24 }} />,
                    },
                    {
                      id: 'tour-date',
                      img: Hotel4,
                      name: t('Дата тура'),
                      title: (() => {
                        const start = formatShortDate(data.departure_date);
                        const endDate = new Date(data.departure_date);
                        if (!Number.isNaN(endDate.getTime())) {
                          endDate.setDate(endDate.getDate() + Math.max((data.duration_days || 1) - 1, 0));
                        }
                        const end = Number.isNaN(endDate.getTime())
                          ? '--.--.--'
                          : formatShortDate(endDate.toISOString());
                        return `${start} - ${end}`;
                      })(),
                      iconNode: <CalendarMonthOutlinedIcon sx={{ color: '#1A73E8', fontSize: 24 }} />,
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      className="h-[145px] w-[186px] shrink-0 rounded-[12px] border border-[#1A73E8] p-4 flex flex-col items-start gap-8"
                    >
                      <HotelInfoItem
                        img={item.img}
                        title={item.title}
                        name={item.name}
                        iconNode={item.iconNode}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              {includedServicesToRender.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={fadeInUp}
                  className="mt-[72px]"
                >
                  <div className="h-px w-full bg-[#11221140]" />

                  <div className="mt-[72px] flex w-full max-w-[1240px] flex-col items-start gap-8">
                    <h3 className="text-[20px] leading-6 font-bold text-[#112211]">
                      {t('Что включено в стоимость тура')}
                    </h3>

                    <div className="flex w-full flex-col items-start gap-4">
                      {includedServicesToRender.slice(0, 3).map((item, index) => {
                        const normalized = `${item.title || ''} ${item.desc || ''}`.toLowerCase();
                        const isIncluded = normalized.includes('включ')
                          ? true
                          : normalized.includes('не включ')
                            ? false
                            : index === 0;

                        return (
                          <div key={`${item.title}-${index}`} className="w-full">
                            <div className="flex w-full items-center justify-between gap-10 max-md:flex-col max-md:items-start max-md:gap-4">
                              <div className="flex items-center gap-4">
                                <div className="relative h-12 w-12 overflow-hidden rounded-[14px]">
                                  <Image
                                    src={item.image || Hotel1.src}
                                    alt={item.title || 'service'}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <p className="text-[16px] leading-5 font-medium text-[#112211]">
                                  {item.title || t('Трансфер')}
                                </p>
                              </div>

                              <div
                                className={clsx(
                                  'flex h-12 w-[186px] items-center justify-center rounded-[14px] border-2 px-4 text-[14px] leading-[17px] font-semibold',
                                  isIncluded
                                    ? 'border-[#1A73E8] text-[#1A73E8]'
                                    : 'border-[#F59E0B] text-[#F59E0B]',
                                )}
                              >
                                {isIncluded ? t('Включено') : t('Не включено')}
                              </div>
                            </div>

                            {index !== Math.min(includedServicesToRender.length, 3) - 1 && (
                              <div className="mt-4 h-px w-full bg-[#11221140]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {amenitiesToRender.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={fadeInUp}
                  className="mt-[72px]"
                >
                  <div className="h-px w-full bg-[#11221140]" />

                  <div className="mt-[72px] flex h-[272px] w-full max-w-[715px] flex-col items-start gap-8 max-lg:h-auto">
                    <h3 className="text-[20px] leading-6 font-bold text-[#112211]">
                      {t('Преимущества отеля размещения:')}
                    </h3>

                    <div className="flex h-[216px] w-full items-start gap-[229px] max-xl:h-auto max-xl:gap-12 max-md:flex-col">
                      <div className="flex w-[299px] max-w-full flex-col items-start gap-6">
                        {amenitiesToRender.slice(0, 5).map((amenity, index) => {
                          const IconComponent =
                            LucideIcons[
                              amenity.icon_name as keyof typeof LucideIcons.icons
                            ];

                          return (
                            <div key={`left-${index}`} className="flex items-center gap-2">
                              {IconComponent ? (
                                <IconComponent className="h-6 w-6 text-[#112211]" />
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-[#112211]" />
                              )}
                              <p className="text-[16px] leading-5 font-medium text-[#112211]">
                                {amenity.name}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex w-[187px] max-w-full flex-col items-start gap-6">
                        {amenitiesToRender.slice(5, 9).map((amenity, index) => {
                          const IconComponent =
                            LucideIcons[
                              amenity.icon_name as keyof typeof LucideIcons.icons
                            ];

                          return (
                            <div key={`right-${index}`} className="flex items-center gap-2">
                              {IconComponent ? (
                                <IconComponent className="h-6 w-6 text-[#112211]" />
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-[#112211]" />
                              )}
                              <p className="text-[16px] leading-5 font-medium text-[#112211]">
                                {amenity.name}
                              </p>
                            </div>
                          );
                        })}

                        {amenitiesToRender.length > 9 && (
                          <p className="text-[16px] leading-5 font-semibold text-[#F59E0B]">
                            {t('еще')} +{amenitiesToRender.length - 9}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="custom-container">
            <div className="mt-[72px] h-px w-full bg-[#11221140]" />
            <div className="mt-[72px]">
              <CommentTour data={data} />
            </div>
            {hotTicket && hotTicket.data.results.tickets.length > 0 && (
              <div className="mt-[72px]">
                <div className="custom-container flex justify-between items-center">
                  <motion.h1
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, x: -60 },
                      visible: () => ({
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.5, duration: 0.5 },
                      }),
                    }}
                    className="text-3xl text-[#232325] font-semibold"
                  >
                    {t('Откройте новые направления')}
                  </motion.h1>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    // variants={{
                    //   hidden: { opacity: 0, x: 60 },
                    //   visible: () => ({
                    //     opacity: 1,
                    //     x: 0,
                    //     transition: { delay: 0.5, duration: 0.5 },
                    //   }),
                    // }}
                    className="flex gap-2"
                  >
                    <Button
                      variant={'outline'}
                      className="rounded-xl w-10 h-10 max-lg:hidden bg-[#F8F8F8] border-[#CBD5E0]"
                      onClick={() => api?.scrollPrev()}
                      disabled={!canScrollPrev}
                    >
                      <KeyboardBackspaceIcon sx={{ color: '#939BA4' }} />
                    </Button>
                    <Button
                      variant={'outline'}
                      className="rounded-xl w-10 h-10 max-lg:hidden border-[#CBD5E0]"
                      onClick={() => api?.scrollNext()}
                      disabled={!canScrollNext}
                    >
                      <KeyboardBackspaceIcon
                        sx={{ rotate: '180deg', color: '#939BA4' }}
                      />
                    </Button>
                  </motion.div>
                </div>
                <Carousel
                  className="w-full mt-4 cursor-pointer"
                  setApi={setApi}
                >
                  <CarouselContent>
                    {hotTicket &&
                      hotTicket.data.results.tickets?.map((item, key) => (
                        <CarouselItem
                          key={key}
                          className="basis-1/4 max-lg:basis-1/2 max-md:basis-[80%]"
                        >
                          <TourOffersItem data={item} />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
