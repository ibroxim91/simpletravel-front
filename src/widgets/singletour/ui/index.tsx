'use client';

import { Link } from '@/shared/config/i18n/navigation';
import { Button } from '@/shared/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import Swiper from '@/shared/ui/swiper';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Hourglass, Scroll } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import 'swiper/css';
import SwiperImage from '../../../../public/images/image1.png';
import Statue from '../../../../public/images/statue.png';
import { foodInfo, hotelAdditionalInfo } from '../lib/data';
import { gap_star, star, tourAdditionalInfo } from '../lib/icons';
import HotelInfoItem from './HotelInfoItem';
import ReviewsItem from './ReviewsItem';
import TourDayItem from './TourDayItem';
import TourFoodItem from './TourFoodItem';
import TourItem from './TourItem';
import TourOffersItem from './TourOffersItem';
import WantHelpModal from './WantHelpModal';
import WatchTour from './WatchTour';

const images: string[] = [
  SwiperImage.src,
  SwiperImage.src,
  SwiperImage.src,
  SwiperImage.src,
];

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
  const tripledItems = [...items, ...items, ...items];

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
              openHelpMobile={openHelpMobile}
              setOpenHelpMobile={setOpenHelpMobile}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col gap-[20px]">
          <Swiper setOpenWatch={setOpenWatch} />
        </div>

        {openWatch && (
          <WatchTour onClose={() => setOpenWatch(false)} images={images} />
        )}
      </div>

      <div className="custom-container">
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInUp}
          >
            <div className="flex items-center justify-between mt-[60px] max-lg:flex-col max-lg:items-start gap-10">
              <div>
                <div className="flex items-center gap-[4px]">
                  {[star, star, star, star, gap_star].map((item, index) => {
                    return <div key={index}>{item}</div>;
                  })}
                </div>
                <h1 className="text-[32px] font-bold">Memories Varadero</h1>

                <div className="flex items-center gap-[8px]">
                  <LocationOnIcon sx={{ color: '#084FE3' }} />

                  <p className="text-[#084FE3]">Куба, Варадеро, Варадеро</p>
                </div>
              </div>

              <div>
                <h1 className="text-[32px] font-bold">12 450 000 сум</h1>
                <div className="flex items-center gap-[8px]">
                  <ErrorIcon sx={{ color: '#084FE3' }} />
                  <p>Без скрытых комиссий</p>
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
            {tourAdditionalInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-center h-full gap-3 px-4 py-2 rounded-lg bg-[#EFF2F6] shadow-sm"
              >
                <div className="flex-shrink-0">{info.icon}</div>
                <p className="text-[14px] flex-1 break-words">{info.name}</p>
              </div>
            ))}
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInUp}
            className="flex items-center gap-4 mt-6 max-lg:flex-col"
          >
            <Link href={`/booking/64`}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-[#1764FC] rounded-[43px] px-[70px] py-[14px] text-white cursor-pointer text-sm max-lg:w-full"
              >
                Забронировать
              </motion.button>
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenHelp(true)}
              className="flex items-center max-lg:hidden justify-center gap-[10px] bg-[#ECF2FF] px-[70px] py-[14px] text-[#084FE3] max-lg:w-full shadow-sm cursor-pointer text-sm rounded-[43px]"
            >
              <ErrorIcon />
              <p>Нужна помощь?</p>
            </motion.button>
            <button
              onClick={() => {
                setOpenHelpMobile(true);
              }}
              className="flex items-center lg:hidden justify-center gap-[10px] bg-[#ECF2FF] px-[70px] py-[14px] text-[#084FE3] max-lg:w-full shadow-sm cursor-pointer text-sm rounded-[43px]"
            >
              <ErrorIcon />
              <p>Нужна помощь?</p>
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
            <h1 className="text-[28px] font-bold">Описание отеля</h1>
            <p className="w-full text-md mt-5 text-[#636363]">
              Уютная зеленая территория этого отеля и песчаный пляж заставят Вас
              отвлечься от будничной суеты. Здесь к услугам отдыхающих
              предлагаются открытые бассейны для взрослых и детей, анимационные
              программы, детская игровая площадка и ресторан международной
              кухни. Общая площадь территории отеля - 82000 кв. м. Год открытия
              отеля - 1998 г. Последняя реновация - 2018 г.
            </p>
            <div className="flex items-center gap-[20px] mt-[24px] max-lg:flex-col max-lg:w-full">
              {hotelAdditionalInfo.map((hotel, index) => (
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
                  <HotelInfoItem hotel={hotel} key={index} />
                </motion.div>
              ))}
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
                Что включено в стоимость тура
              </p>
              <div className="flex gap-4">
                <Button
                  variant={'outline'}
                  className="rounded-full w-10 h-10 max-lg:hidden"
                  onClick={() => tourApi?.scrollPrev()}
                  disabled={!canScrollPrevTour}
                >
                  <KeyboardBackspaceIcon />
                </Button>
                <Button
                  variant={'outline'}
                  className="rounded-full w-10 h-10 max-lg:hidden"
                  onClick={() => tourApi?.scrollNext()}
                  disabled={!canScrollNextTour}
                >
                  <KeyboardBackspaceIcon sx={{ rotate: '180deg' }} />
                </Button>
              </div>
            </div>
            <Carousel
              className="w-full mt-4 cursor-pointer"
              setApi={setTourApi}
            >
              <CarouselContent>
                {tripledItems.map((item, key) => (
                  <CarouselItem
                    key={key}
                    className="flex flex-col w-auto basis-1/5 max-xl:basis-1/3 max-lg:basis-1/2 max-md:basis-[60%] shrink-0 font-medium"
                  >
                    <TourItem key={`${item}-${key}`} />
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
              <h1 className="text-[28px] font-bold">План путешествия</h1>
              <p className="text-[16px]">Каждый день — новые впечатления</p>
              <div className="flex items-center gap-[12px] mt-[24px] py-[12px] bg-linear-to-r from-[#347afb] to-[#1881ef] rounded-[20px] px-[20px]">
                <WatchLaterIcon sx={{ width: '28px', height: '28px' }} />
                <div className="flex max-md:flex-col">
                  <h1 className="text-[16px] font-bold">
                    Продолжительность тура
                  </h1>
                  <p className="text-[16px]">12 дня / 11 ночи</p>
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
            {[1, 2, 3].map((item, key) => (
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
                  isLast={item === 3}
                  isFirst={item === 1}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="h-auto lg:hidden mt-10">
            <Carousel className="w-full cursor-pointer" setApi={setApi}>
              <CarouselContent>
                {[1, 2, 3].map((item, key) => (
                  <CarouselItem
                    key={key}
                    className="flex flex-col w-auto basis-[80%] shrink-0 font-medium"
                  >
                    <TourDayItem
                      key={key}
                      isLast={item === 3}
                      isFirst={item === 1}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={slideIn}
            className="mt-20"
          >
            <h1 className="font-bold text-[28px]">Что подают в отеле</h1>
            <p className="w-[50%] max-lg:w-full text-sm text-[#636363] mt-[12px]">
              Наслаждайтесь завтраками, обедами и ужинами с богатым выбором
              блюд: от свежей выпечки и фруктов до традиционной кухни и
              интернационального меню
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
                  {foodInfo.map((item, index) => (
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
              <h1 className="font-bold text-[28px]">
                Важно знать перед поездкой
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
                  <h1 className="text-[24px] font-bold">ID Турфирмы</h1>
                  <p className="text-sm mt-[10px]">
                    Официально зарегистрированная компания в реестре
                    туроператоров
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="w-[90%] rounded-[8px] p-[10px] bg-linear-to-r from-[#2857bd] to-[#2857bb]">
                    ID: T-10234
                  </div>

                  <div
                    className="w-[20%] bg-[#FFFFFF] justify-center items-center rounded-md cursor-pointer flex h-full"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText('T-10234').then(() => {
                          toast.success('URL nusxalandi', {
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
                <h1 className="font-bold text-[24px]">Требование по визе</h1>
                <p className="text-sm mt-[10px] text-[#636363]">
                  Мы поможем с оформлением и предоставим список документов.
                </p>

                <div className="flex flex-col">
                  <div className="flex items-center gap-5 mt-[20px]">
                    <div className="border border-[#DFDFDF] p-[10px] rounded-[8px]">
                      <Hourglass width={20} height={20} />
                    </div>
                    <div className="w-full">
                      <p className="font-bold text-[#031753]">
                        Срок оформления: 7–10 дней
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
                        Необходимые документы: загранпаспорт (действителен
                        минимум 6 месяцев), фото, анкета, медицинская страховка
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
                        В некоторых странах виза не требуется (уточняйте при
                        бронировании)
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
        <div className="w-full h-[229px] max-lg:h-full rounded-[24px] bg-gradient-to-r from-[#ABDAFF] to-[#F5EDC7] py-[32px]">
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
            className="text-[24px] font-bold text-center mb-6"
          >
            Отзывы наших клиентов
          </motion.h1>
          <Carousel className="w-full mt-4 cursor-pointer" setApi={setApi}>
            <CarouselContent>
              {[...Array(20)].map((_, key) => (
                <CarouselItem
                  key={key}
                  className="flex flex-col w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[70%] shrink-0 font-medium"
                >
                  <motion.div
                    key={key}
                    custom={key}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: (i: number) => ({
                        opacity: 1,
                        y: 0,
                        transition: { delay: i * 0.1, duration: 0.5 },
                      }),
                    }}
                  >
                    <ReviewsItem key={key} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
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
              className="text-3xl text-[#031753] font-semibold"
            >
              Откройте новые направления
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
              className="flex gap-4"
            >
              <Button
                variant={'outline'}
                className="rounded-full w-10 h-10 max-lg:hidden"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
              >
                <KeyboardBackspaceIcon />
              </Button>
              <Button
                variant={'outline'}
                className="rounded-full w-10 h-10 max-lg:hidden"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
              >
                <KeyboardBackspaceIcon sx={{ rotate: '180deg' }} />
              </Button>
            </motion.div>
          </div>
          <Carousel className="w-full mt-4 cursor-pointer" setApi={setApi}>
            <CarouselContent>
              {[1, 2, 3, 4, 5, 6, 8, 9, 10].map((__, key) => (
                <CarouselItem
                  key={key}
                  className="basis-1/5 max-lg:basis-1/3 max-md:basis-1/2"
                >
                  <TourOffersItem />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
