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
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import Rating from '@mui/material/Rating';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Copy, Hourglass, Scroll } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import 'swiper/css';
import Hotel1 from '../../../../public/images/hotel1.png';
import Hotel2 from '../../../../public/images/hotel2.png';
import Hotel3 from '../../../../public/images/hotel3.png';
import Hotel4 from '../../../../public/images/hotel4.png';
import Statue from '../../../../public/images/statue.png';
import { TicketsDetailAPi } from '../lib/api';
import HotelInfoItem from './HotelInfoItem';
import TourDayItem from './TourDayItem';
import TourDetailLoading from './TourDetailLoading';
import TourFoodItem from './TourFoodItem';
import TourItem from './TourItem';
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
  const { data, isLoading } = useQuery({
    queryKey: ['tickets_detail', tourid],
    queryFn: () => TicketsDetailAPi.getTicketsDetail({ id: Number(tourid) }),
    select(data) {
      return data.data.data;
    },
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

  const [openWatch, setOpenWatch] = useState<boolean>(false);
  const [openHelp, setOpenHelp] = useState<boolean>(false);
  const [openHelpMobile, setOpenHelpMobile] = useState<boolean>(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrevTour, setCanScrollPrevTour] = useState(false);
  const [canScrollNextTour, setCanScrollNextTour] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [tourApi, setTourApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const updateButtons = () => {
      setCanScrollNext(api.canScrollNext());
      setCanScrollPrev(api.canScrollPrev());
    };

    updateButtons();
    api.on('select', updateButtons);
  }, [api]);

  useEffect(() => {
    if (!tourApi) return;

    const updateButtons = () => {
      setCanScrollNextTour(tourApi.canScrollNext());
      setCanScrollPrevTour(tourApi.canScrollPrev());
    };

    updateButtons();
    tourApi.on('select', updateButtons);
  }, [tourApi]);

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

  return (
    <div className="bg-white">
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
        ) : (
          <>
            {data && (
              <div className="flex flex-col gap-[20px]">
                <Swiper
                  id={data.id}
                  is_liked={data.is_liked}
                  images={data.ticket_images}
                  setOpenWatch={setOpenWatch}
                />
              </div>
            )}
          </>
        )}

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
              >
                <div className="flex items-center justify-between mt-5 max-lg:flex-col max-lg:items-start gap-10">
                  <div>
                    <div className="flex items-center gap-[4px]">
                      <Rating
                        name="read-only"
                        size="medium"
                        value={data.rating}
                        readOnly
                        sx={{ color: '#F08125' }}
                        precision={0.1}
                      />
                    </div>
                    <h1 className="text-[32px] txt-[#212122] font-bold">
                      {data.title}
                    </h1>

                    <div className="flex items-center gap-[8px]">
                      <LocationOnIcon sx={{ color: '#084FE3' }} />

                      <p className="text-[#084FE3]">{data.destination}</p>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-[32px] text-[#212122] font-bold">
                      {formatPrice(data.price, locale as LanguageRoutes, true)}
                    </h1>
                    <div className="flex items-center gap-[8px]">
                      <ErrorIcon sx={{ color: '#084FE3' }} />
                      <p className="text-[#646465]">
                        {t('Без скрытых комиссий')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUp}
                className="grid grid-cols-5 w-full items-start mt-5 gap-5 max-xl:grid-cols-2 max-md:grid-cols-1"
              >
                {data.ticket_amenities?.map((info, index) => {
                  const IconComponent =
                    LucideIcons[
                      info.icon_name as keyof typeof LucideIcons.icons
                    ];

                  return (
                    <div
                      key={index}
                      className="flex items-center h-full gap-3 px-4 py-2 rounded-lg bg-[#EFF2F6] shadow-sm"
                    >
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 text-[#232325]" />
                      ) : null}
                      <p className="text-[14px] flex-1 break-words text-[#232325]">
                        {info.name}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={fadeInUp}
                className="flex items-center gap-4 mt-5 max-lg:flex-col"
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
                variants={slideIn}
                className="mt-[60px]"
              >
                <h1 className="text-[28px] font-bold text-[#232325]">
                  {t('Описание отеля')}
                </h1>
                <p className="w-full text-md mt-5 text-[#636363]">
                  {data.hotel_info}
                </p>
                <div className="flex items-center gap-[20px] mt-[24px] max-lg:flex-col max-lg:w-full">
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={slideIn}
                    whileHover={{ scale: 1.05 }}
                    className="w-[350px] max-lg:w-full h-[200px] max-lg:h-auto cursor-pointer flex flex-col max-lg:flex-row-reverse justify-between p-[20px] bg-[#EDEEF140] border border-[#EDEEF1] shadow-md rounded-[20px] relative"
                  >
                    <HotelInfoItem
                      img={Hotel1}
                      title={t(`Тип`)}
                      name={t('Отели')}
                    />
                  </motion.div>
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={slideIn}
                    whileHover={{ scale: 1.05 }}
                    className="w-[350px] max-lg:w-full h-[200px] max-lg:h-auto cursor-pointer flex flex-col max-lg:flex-row-reverse justify-between p-[20px] bg-[#EDEEF140] border border-[#EDEEF1] shadow-md rounded-[20px] relative"
                  >
                    <HotelInfoItem
                      img={Hotel2}
                      title={t(`Продолжительность`)}
                      name={`${data.duration_days} ${t('дня')}`}
                    />
                  </motion.div>
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={slideIn}
                    whileHover={{ scale: 1.05 }}
                    className="w-[350px] max-lg:w-full h-[200px] max-lg:h-auto cursor-pointer flex flex-col max-lg:flex-row-reverse justify-between p-[20px] bg-[#EDEEF140] border border-[#EDEEF1] shadow-md rounded-[20px] relative"
                  >
                    <HotelInfoItem
                      img={Hotel3}
                      title={t(`Размер группы`)}
                      name={`${data.passenger_count} ${t('человек')}`}
                    />
                  </motion.div>
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={slideIn}
                    whileHover={{ scale: 1.05 }}
                    className="w-[350px] max-lg:w-full h-[200px] max-lg:h-auto cursor-pointer flex flex-col max-lg:flex-row-reverse justify-between p-[20px] bg-[#EDEEF140] border border-[#EDEEF1] shadow-md rounded-[20px] relative"
                  >
                    <HotelInfoItem
                      img={Hotel4}
                      title={t(`Языки`)}
                      name={data.languages}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={slideIn}
                className="custom-container mt-20"
              >
                <div className="flex justify-between items-center">
                  <p className="text-3xl text-[#031753] font-semibold">
                    {t('Что включено в стоимость тура')}
                  </p>
                  <div className="flex gap-4">
                    <Button
                      variant={'outline'}
                      className="rounded-full w-10 h-10 max-lg:hidden"
                      onClick={() => tourApi?.scrollPrev()}
                      disabled={!canScrollPrevTour}
                    >
                      <KeyboardBackspaceIcon sx={{ color: '#031753' }} />
                    </Button>
                    <Button
                      variant={'outline'}
                      className="rounded-full w-10 h-10 max-lg:hidden"
                      onClick={() => tourApi?.scrollNext()}
                      disabled={!canScrollNextTour}
                    >
                      <KeyboardBackspaceIcon
                        sx={{ rotate: '180deg', color: '#031753' }}
                      />
                    </Button>
                  </div>
                </div>
                <Carousel
                  className="w-full mt-4 cursor-pointer"
                  setApi={setTourApi}
                >
                  <CarouselContent>
                    {data.ticket_included_services?.map((item, key) => (
                      <CarouselItem
                        key={key}
                        className="flex flex-col w-auto basis-1/5 max-xl:basis-1/3 max-lg:basis-1/2 max-md:basis-[60%] shrink-0 font-medium"
                      >
                        <TourItem key={`${item}-${key}`} data={item} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </motion.div>
            </div>
          </div>

          <div className="w-full bg-[#EDEEF1] rounded-[32px] mt-[60px]">
            <div className="custom-container py-30">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={slideIn}
                className="w-full p-[33px] max-lg:p-4 max-lg:h-[500px] rounded-[20px] text-white bg-linear-to-r from-[#1764FC] to-[#42B5CD] flex items-center max-lg:items-start justify-between relative z-10"
              >
                <div>
                  <h1 className="text-[28px] font-bold">
                    {t('План путешествия')}
                  </h1>
                  <p className="text-[16px]">
                    {t('Каждый день — новые впечатления')}
                  </p>
                  <div className="flex items-center gap-[12px] mt-[24px] py-[12px] bg-linear-to-r from-[#347afb] to-[#1881ef] rounded-[20px] px-[20px]">
                    <WatchLaterIcon sx={{ width: '28px', height: '28px' }} />
                    <div className="flex max-md:flex-col gap-1">
                      <h1 className="text-[16px] font-bold">
                        {t('Продолжительность тура')}
                      </h1>
                      <p className="text-[16px]">
                        {data.duration_days} {t('дня')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[10px] lg:-top-[60px] -z-10 lg:pr-[70px] max-lg:left-1 max-lg:bottom-0">
                  <div className="w-[345px] h-[256px] max-lg:w-[100%] max-lg:h-full relative">
                    <Image
                      src={Statue.src}
                      alt={Statue.src}
                      className="w-full h-full"
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={slideIn}
                className="mt-10 max-lg:hidden"
              >
                {data.ticket_itinerary?.map((item, key) => (
                  <motion.div
                    key={key}
                    custom={key}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={slideIn}
                  >
                    <TourDayItem
                      key={key}
                      data={item}
                      isLast={key + 1 === data.ticket_itinerary?.length}
                      isFirst={key + 1 === 1}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <div className="h-auto lg:hidden mt-10">
                {data.ticket_itinerary && (
                  <Carousel className="w-full cursor-pointer" setApi={setApi}>
                    <CarouselContent>
                      {data.ticket_itinerary?.map((item, key) => (
                        <CarouselItem
                          key={key}
                          className="flex flex-col w-auto basis-[80%] shrink-0 font-medium"
                        >
                          <TourDayItem
                            key={key}
                            data={item}
                            isLast={key + 1 === data.ticket_itinerary?.length}
                            isFirst={key + 1 === 1}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                )}
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={slideIn}
                className="mt-20"
              >
                <h1 className="font-bold text-[28px] text-[#232325]">
                  {t('Что подают в отеле')}
                </h1>
                <p className="w-[50%] max-lg:w-full text-sm text-[#636363] mt-[12px]">
                  {data.hotel_meals}
                </p>

                <div className="w-full flex items-center mt-10 gap-[18px]">
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: true,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {data.ticket_hotel_meals?.map((item, index) => (
                        <CarouselItem
                          key={index}
                          className="flex flex-col w-auto basis-1/5 max-xl:basis-1/3 max-lg:basis-1/3 max-md:basis-[50%] max-[420px]:!basis-[70%] shrink-0 font-medium"
                        >
                          <TourFoodItem food={item} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </motion.div>

              <div className="mt-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={fadeInUp}
                >
                  <h1 className="font-bold text-[28px] text-[#232325]">
                    {t('Важно знать перед поездкой')}
                  </h1>
                </motion.div>

                <div className="flex items-center justify-between mt-[24px] gap-[24px] max-lg:flex-col">
                  <motion.div
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
                    className="bg-linear-to-b from-[#084FE3] text-white to-[#0A3CA9] w-[360px] h-[360px] max-lg:w-full rounded-[20px] flex flex-col justify-between p-[32px]"
                  >
                    <div>
                      <h1 className="text-[24px] font-bold">
                        {t('ID Турфирмы')}
                      </h1>
                      <p className="text-sm mt-[10px] text-[#EDEEF1]">
                        {t(
                          'Официально зарегистрированная компания в реестре туроператоров',
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="w-[90%] rounded-[8px] bg-[#FFFFFF1F] p-[10px] text-[#FFFFFF]">
                        {t('ID')}: {data.travel_agency_id}
                      </div>

                      <div
                        className="w-[20%] bg-[#FFFFFF] justify-center items-center rounded-md cursor-pointer flex h-full"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard
                              .writeText(data.travel_agency_id)
                              .then(() => {
                                toast.success(t('URL nusxalandi'), {
                                  position: 'top-center',
                                });
                              });
                          }
                        }}
                      >
                        <Copy color="#000" width={24} height={24} />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, x: 60 },
                      visible: () => ({
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.5, duration: 0.5 },
                      }),
                    }}
                    className="w-full p-[32px] h-[360px] max-lg:h-full bg-[#FFFFFF] rounded-[20px]"
                  >
                    <h1 className="font-bold text-[24px] text-[#212122]">
                      {t('Требование по визе')}
                    </h1>
                    <p className="text-sm mt-[10px] text-[#636363]">
                      {t(
                        'Мы поможем с оформлением и предоставим список документов',
                      )}
                      .
                    </p>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-5 mt-[20px]">
                        <div className="border border-[#DFDFDF] p-[10px] rounded-[8px]">
                          <Hourglass width={20} height={20} />
                        </div>
                        <div className="w-full">
                          <p className="font-bold text-[#031753]">
                            {t('Срок оформления: 7–10 дней')}
                          </p>
                          <hr />
                        </div>
                      </div>
                      <div className="flex items-center gap-5 mt-[20px]">
                        <div className="border border-[#DFDFDF] p-[10px] rounded-[8px]">
                          <Scroll width={20} height={20} />
                        </div>
                        <div className="w-full">
                          <p className="font-bold text-[#031753]">
                            {t(
                              'Необходимые документы: загранпаспорт (действителен минимум 6 месяцев), фото, анкета, медицинская страховка',
                            )}
                          </p>
                          <hr />
                        </div>
                      </div>
                      <div className="flex items-center gap-5 mt-[20px]">
                        <div className="border border-[#DFDFDF] p-[10px] rounded-[8px]">
                          <EmojiObjectsOutlinedIcon width={20} height={20} />
                        </div>
                        <div className="w-full">
                          <p className="font-bold text-[#031753]">
                            {t(
                              'В некоторых странах виза не требуется (уточняйте при бронировании)',
                            )}
                          </p>
                          <hr />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 custom-container bg-[#FFFF] py-10">
            <CommentTour data={data} />
            <div className="mt-10">
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
                  variants={{
                    hidden: { opacity: 0, x: 60 },
                    visible: () => ({
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.5, duration: 0.5 },
                    }),
                  }}
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
              <Carousel className="w-full mt-4 cursor-pointer" setApi={setApi}>
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
          </div>
        </>
      )}
    </div>
  );
}
