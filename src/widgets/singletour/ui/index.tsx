'use client';

import { User_Api } from '@/features/profile/lib/api';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Skeleton } from '@/shared/ui/skeleton';
import Swiper from '@/shared/ui/swiper';
import Ticket_Api from '@/widgets/selectour/lib/api';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
import { Check } from "lucide-react";
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
import Hotel1 from '../../../../public/icons/hotel.svg';
import Support from '../../../../public/icons/support.svg';
import Food from '../../../../public/icons/meal.svg';
import Insurance from '../../../../public/icons/insurance.svg';
import Bus from '../../../../public/icons/transfer.svg';
import Hotel_Star from '../../../../public/images/hotel_star.png';
import Flight from '../../../../public/icons/flight.svg';
import { TicketsDetailAPi } from '../lib/api';
import HotelInfoItem from './HotelInfoItem';
import TourDayItem from './TourDayItem';
import TourDetailLoading from './TourDetailLoading';
import TourFoodItem from './TourFoodItem';
import TourOffersItem from './TourOffersItem';
import WantHelpModal from './WantHelpModal';
import WatchTour from './WatchTour';
import CommentTour from './commentTour';
import HotelRooms from './HotelRooms';
import InterestPoints from './InterestPoints';
import { BASE_URL } from '@/shared/config/api/URLs';

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
  const [tourOperatorId, setTourOperatorId] = useState<string | null>(null);
  
  useEffect(() => {
    setTourOperatorId(localStorage.getItem('tourOperatorId'));
  }, []);
  const route = useRouter();
  const { tourid, locale } = useParams();
  // const tourOperatorId =
  //   typeof window !== 'undefined' ? localStorage.getItem('tourOperatorId') : null;
 const idFromSlug = Array.isArray(tourid)
    ? Number(tourid[tourid.length - 1].split('-').pop())
    : tourid
      ? Number(tourid.split('-').pop())
      : undefined;

  const formatShortDate = (value?: string) => {
  if (!value) return '--.--.--';

  let date: Date | null = null;

  // Agar format YYYYMMDD bo'lsa (masalan: 20260517)
  if (/^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    date = new Date(`${year}-${month}-${day}`);
  } else {
    // Oddiy ISO yoki boshqa format
    date = new Date(value);
  }

  if (!date || Number.isNaN(date.getTime())) return '--.--.--';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}.${month}.${year}`;
};
    
  // const formatShortDate = (value?: string) => {
  //   if (!value) return '--.--.--';
  //   const date = new Date(value);
  //   if (Number.isNaN(date.getTime())) return '--.--.--';
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = String(date.getFullYear()).slice(-2);
  //   return `${day}.${month}.${year}`;
  // };

  // const { data, isLoading } = useQuery({
  //   queryKey: ['tickets_detail', tourOperatorId],
  //   queryFn: () =>
  //     TicketsDetailAPi.getTicketsDetail({ id: String(tourOperatorId) }),
  //   select(data) {
  //     console.log("data.data.data ",data.data.data)
  //     localStorage.setItem("tour", JSON.stringify(data.data.data));
  //     return data.data.data;
  //   },
  //    enabled: !!tourOperatorId, // faqat ID mavjud bo‘lsa ishlaydi
  //   staleTime: 0,              // har safar yangi fetch
  //   cacheTime: 0,
  // });

const data = typeof window !== 'undefined'
  ? JSON.parse(localStorage.getItem("tour") || "null")
  : null;

    const [likedIds, setLikedIds] = useState<string[]>([])
   
  
  useEffect(() => {
    const saved = localStorage.getItem("likedTours")
    if (saved) {
      try {
        const parsed: Tour[] = JSON.parse(saved)
        setLikedIds(parsed.map((t) => t.tour_operator_id))
      } catch {
        setLikedIds([])
      }
    }
  }, [])
  
  
  const toggleLike = (tour: Tour) => {
    const saved = localStorage.getItem("likedTours")
    let liked: Tour[] = saved ? JSON.parse(saved) : []
  
    if (likedIds.includes(tour.tour_operator_id)) {
      // unlike
      liked = liked.filter((t) => t.tour_operator_id !== tour.tour_operator_id)
    } else {
      // like (agar 10 tadan oshmagan bo‘lsa)
      if (liked.length < 10) {
        liked.push(tour)
      }
    }
  
    localStorage.setItem("likedTours", JSON.stringify(liked))
    setLikedIds(liked.map((t) => t.tour_operator_id)) 
  }
  
  const isLiked = likedIds.includes(data.tour_operator_id)
  



const { data: hotelData, isLoading, error } = useQuery({
  queryKey: ["hotel_detail", data.ticket_hotel[0].id],
  queryFn: async () => {
    const hotel = data.ticket_hotel[0];
    const url = new URL(`${BASE_URL}/api/v1/hotels/`);

    url.searchParams.append("hotel_name", hotel.name);
    url.searchParams.append("hotel_id", hotel.id.toString());
    url.searchParams.append("operator", data.operator);
    url.searchParams.append("country_id", data.destination.country.id.toString());
    url.searchParams.append("meal_plan", hotel.meal_plan);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch hotel data");
    }

    return res.json();
  },
  enabled: !!data?.ticket_hotel?.length, // faqat hotel mavjud bo‘lsa so‘rov yuboriladi
});

console.log("hotelData ", hotelData)

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

 if (!data) {
  return <TourDetailLoading />
 }
      const hotelRating = (() => {
        const rating = data.ticket_hotel?.[0]?.rating;
        if (!rating) return "";

        if (!isNaN(Number(rating))) {
          return `${rating} ★`; // string qaytadi
        }
        return rating;
      })();



  const meal = data.ticket_hotel?.[0]?.meal_plan;
                        const mealMap: Record<string, string> = {
                          FB: t('Полный пансион'),
                          BB: t('Завтрак'),
                          HB: t('Полупансион'),
                          AI: t('Все включено'),
                          UAI: t('Все включено'),
                          RO: t('Без питания'),
                        };
  const mealLabel = mealMap[meal] || t('Все включено');


const includedServicesToRender = [
  { image: Flight.src, title: t('Авиаперелёт'), desc: t('Включено'), included: true },
  { image: Bus.src, title: t('Трансфер'), desc: t('Включено'), included: true },
  { image: Hotel1.src, title: `${t('Проживание')} (${t('гостиница')} ${hotelRating})`, desc: t('Включено'), included: true },
  {image: Food.src, title: `${ t('Питание')} (${t(meal)})`, desc: meal === 'RO' ? t('Не включено') : t('Включено'), included: meal === 'RO' ? false : true},
  { image: Insurance.src, title: t('Страхование'), desc: t('Включено'), included: true },
  { image: Support.src, title: t('24/7 техподдержка'), desc: t('Включено'), included: true }
];


  // const amenitiesToRender =
  //   data?.ticket_amenities?.length > 0
  //     ? data.ticket_amenities
  //     : [
  //         { icon_name: 'Waves', name: t('Открытый бассейн') },
  //         { icon_name: 'Waves', name: t('Закрытый бассейн') },
  //         { icon_name: 'Flower2', name: t('Спа- и оздоровительный центр') },
  //         { icon_name: 'UtensilsCrossed', name: t('Ресторан') },
  //         { icon_name: 'Bell', name: t('Обслуживание номеров') },
  //         { icon_name: 'Dumbbell', name: t('Фитнес зал') },
  //         { icon_name: 'Wine', name: t('Бар') },
  //         { icon_name: 'Wifi', name: t('Бесплатный Wi Fi') },
  //         { icon_name: 'Coffee', name: t('Чай/Кофе машина') },
  //       ];


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
        {!data ? (
          <Skeleton className="h-[400px] w-full bg-gray-200" />
        ) : null}

        {/* {console.log("DATA IN SINGLE TOUR", data)}
        {console.log("openWatch IN SINGLE TOUR", openWatch)}
        {console.log("HOTEL DATA IN SINGLE TOUR", hotelData?.data?.photos.length)} */}

        {openWatch && data && hotelData?.data?.photos?.length > 0 &&(
         <WatchTour
        onClose={() => setOpenWatch(false)}
        images={hotelData?.data?.photos}
      />

        )}
      </div>
      {data && (
        <>
          <div className="custom-container max-lg:px-5">
            <div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUp}
                className="flex flex-col gap-8 pt-6"
              >
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={
                    <KeyboardArrowRightIcon
                      sx={{ fontSize: 18, color: 'rgba(17, 34, 17, 0.7)' }}
                      aria-hidden
                    />
                  }
                  sx={{
                    '& .MuiBreadcrumbs-separator': {
                      mx: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
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

                <div className="flex items-end justify-between gap-8 max-lg:flex-col max-lg:items-start max-lg:gap-6">
                  <div className="flex max-w-[684px] flex-col gap-6 max-lg:w-full max-lg:gap-4">
                    <div className="hidden w-full items-center justify-between max-lg:flex">
                     <div className="flex items-center gap-2">
                        {typeof data.ticket_hotel?.[0]?.rating === "number" ? (
                          <>
                            <Rating
                              name="read-only-mobile"
                              size="small"
                              value={data.ticket_hotel?.[0]?.rating || 0}
                              readOnly
                              sx={{ color: '#FF6B00' }}
                              precision={0.1}
                            />
                            <p className="text-[12px] font-medium leading-[15px] text-[#112211]">
                              {Math.round(data.ticket_hotel?.[0]?.rating || 0)} {t('звездочный отель')}
                            </p>
                          </>
                        ) : (
                          <p className="text-[12px] font-medium leading-[15px] text-[#112211]">
                            {data.ticket_hotel?.[0]?.rating}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(data);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)]"
                      >
                        <FavoriteRoundedIcon
                          sx={{ color: isLiked ? '#E03137' : '#9CA3AF', fontSize: 20 }}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-6 max-lg:hidden max-md:flex-col max-md:items-start max-md:gap-2">
                      <h1 className="text-[20px] leading-[24px] font-bold text-[#112211]">
                        {data.title}
                      </h1>
                      <div className="flex items-center gap-2">
                          {typeof data.ticket_hotel?.[0]?.rating === "number" ? (
                            <>
                              <Rating
                                name="read-only"
                                size="small"
                                value={data.ticket_hotel?.[0]?.rating || 0}
                                readOnly
                                sx={{ color: '#FF6B00' }}
                                precision={0.1}
                              />
                              <p className="text-[14px] font-medium text-[#112211]">
                                {Math.round(data.ticket_hotel?.[0]?.rating || 0)} {t('звездочный отель')}
                              </p>
                            </>
                          ) : (
                            <p className="text-[14px] font-medium text-[#112211]">
                              {data.ticket_hotel?.[0]?.rating}
                            </p>
                          )}
                        </div>

                    </div>

                    <h1 className="hidden text-[24px] font-bold leading-[29px] text-[#1C1C1E] max-lg:block">
                      {data.title}
                    </h1>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-4 max-lg:gap-2">
                        <LocationOnIcon sx={{ color: '#1A73E8', fontSize: 20 }} />
                        <p className="text-[12px] font-medium leading-[15px] text-[#6B7280]/75">
                          {data.destination?.name}
                        </p>
                        {data.visa_required && (
                          <span className="rounded-[14px] bg-[#F59E0B] px-2 py-1 text-[12px] font-medium leading-[15px] text-white max-lg:hidden">
                            {t('Необходима Виза')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <HotelOutlinedIcon sx={{ color: '#1A73E8', fontSize: 20 }} />
                        <p className="text-[12px] font-medium leading-[15px] text-[#6B7280]/75">
                          {t('Отель')} {data.ticket_hotel?.[0]?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full max-w-[301px] flex-col items-end gap-4 max-lg:hidden max-lg:items-start">
                    <h1 className="text-right text-[24px] leading-[29px] max-lg:text-left font-bold text-[#1C1C1E]">
                      {Number(data.price_full).toLocaleString('uz-UZ')}  uzs 
                      <span className="text-[24px] font-normal">
                       /{' '} {data?.passenger_count} {t('человек')}
                      </span>
                    </h1>
                    <div className="flex items-center gap-6">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(data);
                          
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_0_4px_rgba(0,0,0,0.15)] max-lg:hidden"
                      >
                        <FavoriteRoundedIcon
                          sx={{ color: isLiked ? '#E03137' : '#9CA3AF', fontSize: 20 }}
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
                              `/auth/register?callbackUrl=${encodeURIComponent(window.location.href)}`,
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
                className="mt-4 max-lg:mt-6 max-lg:mb-0"
              >
                {/* Agar rasmlar soni < 5 bo‘lsa yoki 0 bo‘lsa → har doim Swiper */}
                {(!hotelData?.data?.photos || hotelData.data.photos.length < 5) ? (
                  <Swiper
                    id={data.id}
                    is_liked={data.is_liked}
                    images={[{"image": data.ticket_images }]} // Agar photos bo‘sh bo‘lsa, main_photo ni bering
                    setOpenWatch={setOpenWatch}
                  />
                ) : (
                  <>
                    {/* Mobil ekranda Swiper */}
                    <div className="block lg:hidden">
                      <Swiper
                        id={data.id}
                        is_liked={data.is_liked}
                        images={hotelData.data.photos}
                        setOpenWatch={setOpenWatch}
                      />
                    </div>

                    {/* Katta ekranda grid layout */}
                    <div className="hidden lg:flex gap-4">
                      <div className="w-1/2 relative aspect-video">
                        <Image
                          src={hotelData.data.photos[0].image}
                          alt="Hotel main"
                          fill
                          className="object-cover rounded-lg cursor-pointer"
                          onClick={() => setOpenWatch(true)}
                        />
                      </div>
                      <div className="w-1/2 relative">
                        <div className="grid grid-cols-2 gap-2 h-full">
                          {hotelData.data.photos.slice(1, 5).map((img: { image: string }, idx: number) => (
                            <div key={idx} className="relative aspect-square">
                              <Image
                                src={img.image}
                                alt={`Hotel ${idx + 1}`}
                                fill
                                className="object-cover rounded-lg cursor-pointer"
                                onClick={() => setOpenWatch(true)}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setOpenWatch(true)}
                          className="absolute bottom-2 right-2 bg-[#1A73E8] text-white px-4 py-2 rounded text-sm"
                        >
                          Barcha rasmlarni ko'rish
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>


               {data.visa_required && (     
              <div className="hidden w-full max-lg:block max-lg:my-8">
                <div className="flex min-h-[151px] w-full flex-col gap-[10px] rounded-[14px] bg-[#F59E0B] p-4">
                  <p className="text-[14px] font-medium leading-[100%] text-white">
                    {t('Singletour_visa_notice_title')}
                  </p>
                  <p className="text-[14px] font-medium leading-[100%] text-white">
                    {t('Singletour_visa_notice_body')}
                  </p>
                </div>
              </div>
              )}

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
                        `/auth/register?callbackUrl=${encodeURIComponent(window.location.href)}`,
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

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                // variants={slideIn}
                className="mb-[72px] mt-[72px] flex w-full max-w-[1240px] flex-col gap-6 max-lg:mt-0 max-xl:h-auto"
              >
                <div className="flex w-full flex-col items-start gap-4 max-lg:max-w-full">
                  <h1 className="w-full text-[20px] font-semibold leading-6 text-[#1C1C1E]">
                    {t('Описание отеля')} 
                  </h1>
                 <p className="w-full text-[14px] font-medium leading-[17px] text-[#1C1C1E] opacity-75 max-lg:h-auto max-lg:overflow-visible lg:h-[120px] lg:overflow-hidden">
                    {hotelData?.data?.description 
                      ? hotelData.data.description 
                      : t('default_hotel_description')}
                  </p>

                </div>
                <div className="flex w-full flex-col items-stretch gap-2 overflow-visible max-lg:gap-2 max-xl:flex-wrap lg:h-[145px] lg:flex-row lg:items-start lg:gap-6">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="flex w-full shrink-0 rounded-[12px] bg-[#1A73E8] px-4 py-2 max-lg:min-h-[56px] max-lg:flex-row max-lg:items-center max-lg:justify-between lg:h-[145px] lg:w-[187px] lg:flex-col lg:justify-between lg:p-4"
                  >
                    <p className="text-[32px] font-bold leading-10 text-white tabular-nums">
                      {Number(data.rating || 0).toFixed(1)}
                    </p>
                    <div className="flex flex-col items-end gap-1 max-lg:shrink-0">
                      <p className="text-right text-[16px] font-bold leading-5 text-white">
                        {t('Очень хорошо')}
                      </p>
                      <p className="text-right text-[12px] font-normal leading-[15px] text-white">
                        {data.ticket_comments?.length || 0} {t('отзывов')}
                      </p>
                    </div>
                  </motion.div>

                  {[
                    {
                        id: 'hotel-type',
                        img: Hotel_Star,
                        name: t('Тип отеля'),
                        title:
                          typeof data.ticket_hotel?.[0]?.rating === "number"
                            ? `${data.ticket_hotel?.[0]?.rating || '-'} ${t('звездочный')}`
                            : `${data.ticket_hotel?.[0]?.rating || '-'}`,
                        iconNode: <StarBorderRoundedIcon sx={{ color: '#1A73E8', fontSize: 24 }} />,
                      },
                    {
                      id: 'meal',
                      img: Hotel_MEAL,
                      name: t('Питание'),
                      title: (() => {
                        const meal = data.ticket_hotel?.[0]?.meal_plan;
                        const mealMap: Record<string, string> = {
                          FB: t('Полный пансион'),
                          BB: t('Завтрак'),
                          HB: t('Полупансион'),
                          AI: t('Все включено'),
                          UAI: t('Все включено'),
                          RO: t('Без питания'),
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
                        const endDate = formatShortDate(data.travel_time);
                        // const endDate = new Date(start);
                        // if (!Number.isNaN(endDate.getTime())) {
                        //   endDate.setDate(endDate.getDate() + Math.max((data.duration_days || 1) - 1, 0));
                        // }
                        // const end = Number.isNaN(endDate.getTime())
                        //   ? '--.--.--'
                        //   : formatShortDate(endDate.toISOString());
                        return `${start} - ${endDate}`;
                      })(),
                      iconNode: <CalendarMonthOutlinedIcon sx={{ color: '#1A73E8', fontSize: 24 }} />,
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.03 }}
                      className="flex min-h-[59px] w-full shrink-0 flex-col items-stretch justify-center rounded-[12px] border border-[#1A73E8] px-4 
                      py-2 max-lg:min-h-[59px] max-lg:w-full lg:h-[145px] lg:w-[186px] lg:gap-0 lg:p-4"
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

              <div className="mt-12 mb-12 flex w-full flex-col gap-4 lg:hidden">
                <p className="w-full text-left text-[20px] font-bold leading-6 text-[#1C1C1E]">
                {Number(data.price_full).toLocaleString('uz-UZ')} uzs  /{' '}
                  <span className="font-normal">{data.passenger_count || 1} {t('человек')}</span>
                </p>
                {user ? (
                  <Link href={`/booking/${data.id}`} className="block w-full">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#FF6B00] px-4 text-[14px] font-semibold leading-[17px] text-white"
                    >
                      {t('Забронировать')}
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      route.push(
                        `/auth/register?callbackUrl=${encodeURIComponent(window.location.href)}`,
                      );
                    }}
                    className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#FF6B00] px-4 text-[14px] font-semibold leading-[17px] text-white"
                  >
                    {t('Забронировать')}
                  </motion.button>
                )}
              </div>

              {includedServicesToRender.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={fadeInUp}
                  className="mt-[72px] max-lg:mt-0"
                >
                  <div className="h-px w-full bg-[#11221140]" />

                  <div className="mt-[72px] flex w-full max-w-[1240px] flex-col items-start gap-8">
                    <h3 className="text-[20px] leading-6 font-bold text-[#112211]">
                      {t('Что включено в стоимость тура')}
                    </h3>

                    <div className="flex w-full flex-col items-start gap-4">
                      {includedServicesToRender.slice(0, 10).map((item, index) => {
                        return (
                          <div key={`${item.title}-${index}`} className="w-full">
                            <div className="flex w-full items-center justify-between gap-10 max-md:items-start max-md:gap-4">
                              <div className="flex items-center gap-4 ">
                                <div className="relative  h-8 w-8 text-sm  overflow-hidden rounded-[14px]">
                                  <Image
                                    src={item.image || Bus.src}
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
                                  'flex items-center justify-center rounded-md border-2',
                                  'px-3 py-1 text-sm md:px-4 md:py-2 md:text-base font-semibold',
                                  item.included
                                    ? 'border-[#1A73E8] text-[#1A73E8]'
                                    : 'border-[#F59E0B] text-[#F59E0B]',
                                )}
                              >
                                {item.included ? t('Включено') : t('Не включено')}
                              </div>

                            </div>

                            {index !== Math.min(includedServicesToRender.length, 10) - 1 && (
                              <div className="mt-4 h-px w-full bg-[#11221140]" />
                            )}
                          </div>
                        );
                      })}
                    </div>


                  </div>
                </motion.div>
              )}

              {data && (
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
                      {t('Информация о номере')}
                    </h3>

                    <div className="flex w-full flex-col items-start gap-6">
                      <div className="flex items-center justify-between w-full gap-4">
                        <p className="text-[16px] font-medium text-[#112211]">
                          {t('Категория номера')}:
                        </p>
                        <p className="text-[16px] font-semibold text-[#1A73E8]">
                          {data.room_type || '--'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between w-full gap-4">
                        <p className="text-[16px] font-medium text-[#112211]">
                          {t('Тип размещения')}:
                        </p>
                        <p className="text-[16px] font-semibold text-[#1A73E8]">
                          {data.place || '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {hotelData?.data?.facilities && hotelData.data.facilities.length > 0 && (
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
                          {hotelData.data.facilities.slice(0, 5).map((amenity, index) => (
                            <div key={`left-${index}`} className="flex items-center gap-2">
                              <Check className="h-6 w-6 text-[#112211]" />
                              <p className="text-[16px] leading-5 font-medium text-[#112211]">
                                {amenity.description_ru}
                              </p>
                            </div>
                          ))}
                        </div>

                   <div className="flex w-[299px] max-w-full flex-col items-start gap-6">
                      {hotelData.data.facilities.slice(5, 10).map((amenity, index) => (
                        <div key={`left-${index}`} className="flex items-center gap-2">
                          <Check className="h-6 w-6 text-[#112211]" />
                          <p className="text-[16px] leading-5 font-medium text-[#112211]">
                            {amenity.description_ru}
                          </p>
                        </div>
                      ))}
                

                        {hotelData.data.facilities.length > 10 && (
                          <p className="text-[16px] leading-5 font-semibold text-[#F59E0B]">
                            {t('еще')} +{hotelData.data .facilities.length - 10}
                          </p>
                        )}
                      </div>


                    </div>
                  </div>
                </motion.div>
              )}

              {hotelData?.data?.rooms && hotelData.data.rooms.length > 0 && (
                <HotelRooms rooms={hotelData.data.rooms} />
              )}

              {hotelData?.data?.interest_points && hotelData.data.interest_points.length > 0 && (
                <InterestPoints points={hotelData.data.interest_points} />
              )}
            </div>
          </div>

          <div className="custom-container max-lg:px-5">
            <div className="mt-[72px] h-px w-full bg-[#11221140]" />
            <div className="mt-[72px]">
              <CommentTour data={data} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}


