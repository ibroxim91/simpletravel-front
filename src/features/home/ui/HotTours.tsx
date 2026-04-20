'use client';

import BannerCircle from '@/assets/hotBanner.png';
import BannerCircleMobile from '@/assets/hotBannerMobile.png';
import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Rating from '@mui/material/Rating';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HotelIcon, MapPin, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getBanner } from '../lib/api';

const HotTours = () => {
  const t = useTranslations();
  const { locale } = useParams();
  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket_no_visa'],
    queryFn: () =>
      Ticket_Api.GetHomeTickets(),
  });

  const { data: hotTicket, isLoading: hotLoading } = useQuery({
    queryKey: ['ticket_hot'],
    queryFn: () =>
      Ticket_Api.GetHomeTickets(),
  });
  const {
    data: banner,
    isLoading: bannerLoad,
    isError: bannerError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['get_banner4'],
    queryFn: () => getBanner({ page: 1, page_size: 99, position: 'banner4' }),
    select: (data) => data.data.data,
  });

  const [api, setApi] = useState<CarouselApi>();
  const [hot, setHot] = useState<CarouselApi>();
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [hotScrollNext, setHotScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [hotScrollPrev, setHotScrollPrev] = useState(false);

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
    if (!hot) return;

    const updateButtons = () => {
      setHotScrollNext(hot.canScrollNext());
      setHotScrollPrev(hot.canScrollPrev());
    };

    updateButtons();
    hot.on('select', updateButtons);
  }, [hot]);


    function updateData(e) {
        const filters = {
          departure: e.departure_id,
          destination: e.destination_id,
          // dateFrom: e.checkIn,
          // dateTo: e.checkOut,
          adults: e.adult,
          children: e.child,
          operator: e.operator,
        };
        localStorage.setItem('filterTours', JSON.stringify(filters));
  }
  return (
    <>
      {ticket && ticket.data.results.tickets.length > 0 && (
        <div className="custom-container mt-20">
          <div className="flex justify-between items-center">
            <Link
              href="/selectour"
              prefetch
              className="text-3xl text-[#031753] font-semibold"
            >
              {t('Увидеть без визы')}
            </Link>
            <div className="flex gap-4">
              <Button
                variant={'outline'}
                className="rounded-full w-10 h-10 max-lg:hidden"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                aria-label="Scroll to previous item"
              >
                <KeyboardBackspaceIcon sx={{ color: '#031753' }} />
              </Button>
              <Button
                variant={'outline'}
                className="rounded-full w-10 h-10 max-lg:hidden"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                aria-label="Scroll to next item"
              >
                <KeyboardBackspaceIcon
                  sx={{ rotate: '180deg', color: '#031753' }}
                />
              </Button>
            </div>
          </div>
          <Carousel className="w-full mt-4 cursor-pointer" setApi={setApi}>
            <CarouselContent>
              {isLoading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex flex-col w-auto basis-1/4 max-lg:basis-1/3 max-md:basis-[70%] shrink-0"
                    >
                      <div className="w-full aspect-square relative overflow-hidden rounded-3xl shadow-lg">
                        <Skeleton className="w-full h-full" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CarouselItem>
                  ))
                : ticket?.data.results.tickets.map((e, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex flex-col w-auto basis-1/4 max-lg:basis-1/3 max-md:basis-[70%] shrink-0 font-medium"
                    >
                      <Link href={`/selectour/${e.tour_operator_id}/?departure=${e.departure_id}&destination=${e.destination_id}&adults=${e.adults}&operator=${e.tour_operator}`} 
                      onClick={() => {
                        localStorage.setItem("tourOperator", e?.operator ?? "");
                        localStorage.setItem("tourOperatorId", String(e?.tour_operator_id ?? ""));
                        updateData(e)
                      }} 
                      prefetch={true}>
                      
                   
                        <motion.div
                          initial={{ opacity: 0, y: 40, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: false, amount: 0.1 }}
                          transition={{
                            duration: 0.6,
                            delay: idx * 0.15,
                            ease: 'easeOut',
                          }}
                          className="w-full aspect-square relative group overflow-hidden rounded-3xl shadow-lg"
                        >
                          <Image
                            src={BASE_URL + e.ticket_images}
                            alt={e.title}
                            fill
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="flex flex-col absolute top-2 left-4 gap-2 z-20">
                            {e.badge.map((e) => (
                              <Badge
                                key={e.id}
                                variant="default"
                                className={`bg-[${e.color}] text-sm px-4 py-1 rounded-4xl font-semibold`}
                                style={{ background: e.color }}
                              >
                                {e.name}
                              </Badge>
                            ))}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false, amount: 0.1 }}
                          transition={{ duration: 0.6, delay: idx * 0.2 }}
                          className="mt-4"
                        >
                          <Rating
                            name="read-only"
                            size="medium"
                            value={e.rating}
                            readOnly
                            sx={{ color: '#F08125' }}
                            precision={0.1}
                          />
                          <p className="text-xl font-semibold text-[#031753]">
                            {e.title}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <MapPin className="size-6" color="#084FE3" />
                            <p className="line-clamp-1 w-fit text-md text-[#031753]">
                              {e.destination?.name}
                            </p>
                          </div>
                          {e.ticket_hotel.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              <HotelIcon className="size-6" color="#084FE3" />
                              <p className="line-clamp-1 w-fit text-md text-[#031753]">
                                {e.ticket_hotel[0].name}
                              </p>
                            </div>
                          )}
                          {e.ticket_hotel.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              <Star className="size-6" color="#084FE3" />
                              <p className="line-clamp-1 w-fit text-md text-[#031753]">
                                {e.ticket_hotel[0].rating} {t('звёзды')}
                              </p>
                            </div>
                          )}
                          <p className="mt-2 text-[#084FE3] font-semibold text-lg">
                            {formatPrice(
                              e.price,
                              locale as LanguageRoutes,
                              true,
                            )}
                          </p>
                        </motion.div>
                      </Link>
                    </CarouselItem>
                  ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
      {hotTicket && hotTicket?.data.results.tickets.length > 0 && (
        <div className="custom-container mt-20">
          <div className="flex justify-between items-center">
            <Link
              href="/selectour"
              className="text-3xl text-[#031753] font-semibold"
            >
              {t('Горящие туры')}
            </Link>
            <div className="flex gap-4">
              <Button
                variant={'outline'}
                className="rounded-full w-10 h-10 max-lg:hidden"
                onClick={() => hot?.scrollPrev()}
                disabled={!hotScrollPrev}
                aria-label="Scroll hot tours to previous item"
              >
                <KeyboardBackspaceIcon sx={{ color: '#031753' }} />
              </Button>
              <Button
                variant={'outline'}
                className="rounded-full w-10 h-10 max-lg:hidden"
                onClick={() => hot?.scrollNext()}
                disabled={!hotScrollNext}
                aria-label="Scroll hot tours to next item"
              >
                <KeyboardBackspaceIcon
                  sx={{ rotate: '180deg', color: '#031753' }}
                />
              </Button>
            </div>
          </div>

          <Carousel className="w-full mt-4 cursor-pointer" setApi={setHot}>
            <CarouselContent>
              {hotLoading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex flex-col w-auto basis-1/4 max-lg:basis-1/3 max-md:basis-[70%] shrink-0"
                    >
                      <div className="w-full aspect-square relative overflow-hidden rounded-3xl shadow-lg">
                        <Skeleton className="w-full h-full" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CarouselItem>
                  ))
                : hotTicket?.data.results.tickets.map((e, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex flex-col w-auto basis-1/4 max-lg:basis-1/3 max-md:basis-[70%] shrink-0 font-medium"
                    >
                      <Link href={`/selectour/${e.slug}/?departure=${e.departure_id}&destination=${e.destination_id}&adults=${e.adults}&operator=${e.tour_operator}`}
                      onclick={() => {
                        localStorage.setItem("tourOperator", e?.operator ?? "");
                        localStorage.setItem("tourOperatorId", String(e?.tour_operator_id ?? ""));
                        updateData(e)
                      }
                    }
                      prefetch={true}>
                        <motion.div
                          initial={{ opacity: 0, y: 40, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: false, amount: 0.1 }}
                          transition={{
                            duration: 0.6,
                            delay: idx * 0.15,
                            ease: 'easeOut',
                          }}
                          className="w-full aspect-square relative group overflow-hidden rounded-3xl shadow-lg"
                        >
                          {e.ticket_images && (
                            <Image
                              src={BASE_URL + e.ticket_images}
                              alt={e.title}
                              fill
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="flex flex-col absolute top-2 left-4 gap-2 z-20">
                            {e.badge.map((e) => (
                              <Badge
                                key={e.id}
                                variant="default"
                                className={`!bg-[${e.color}] text-sm px-4 py-1 rounded-4xl font-semibold`}
                                style={{ background: e.color }}
                              >
                                {e.name}
                              </Badge>
                            ))}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: false, amount: 0.1 }}
                          transition={{ duration: 0.6, delay: idx * 0.2 }}
                          className="mt-4"
                        >
                          <Rating
                            name="read-only"
                            size="medium"
                            value={e.rating}
                            readOnly
                            sx={{ color: '#F08125' }}
                            precision={0.1}
                          />
                          <p className="text-xl font-semibold text-[#031753]">
                            {e.title}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <MapPin className="size-6" color="#084FE3" />
                            <p className="line-clamp-1 w-fit text-md text-[#031753]">
                              {e.destination?.name}
                            </p>
                          </div>
                          {e.ticket_hotel.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              <HotelIcon className="size-6" color="#084FE3" />
                              <p className="line-clamp-1 w-fit text-md text-[#031753]">
                                {e.ticket_hotel[0].name}
                              </p>
                            </div>
                          )}
                          {e.ticket_hotel.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              <Star className="size-6" color="#084FE3" />
                              <p className="line-clamp-1 w-fit text-md text-[#031753]">
                                {e.ticket_hotel[0].rating} {t('звёзды')}
                              </p>
                            </div>
                          )}
                          <p className="mt-2 text-[#084FE3] font-semibold text-lg">
                            {formatPrice(
                              e.price,
                              locale as LanguageRoutes,
                              true,
                            )}
                          </p>
                        </motion.div>
                      </Link>
                    </CarouselItem>
                  ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
      {bannerLoad ? (
        <div className="mt-10 custom-container h-[300px]">
          <Skeleton className="w-full h-full" />
        </div>
      ) : bannerError ? (
        <div className="custom-container mt-10 max-lg:hidden text-center py-10">
          <p className="text-lg font-medium text-red-600">
            {t('Ошибка при загрузке баннера')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {(error as Error)?.message || t('Попробуйте еще раз')}
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            {t('Обновить')}
          </Button>
        </div>
      ) : (
        <>
          {banner && (
            <div className="custom-container mt-10 max-lg:hidden">
              <Carousel opts={{ loop: true, align: 'start' }}>
                <CarouselContent>
                  {banner?.results.map((e) => (
                    <CarouselItem className="basis-full" key={e.id}>
                      <div className="w-full h-[300px] relative flex rounded-4xl">
                        <div className="h-[300px] w-full overflow-hidden relative">
                          <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                            className="w-[70%] h-[300px] z-10 absolute left-0 bottom-0 font-medium"
                          >
                            <Image
                              src={BannerCircle}
                              alt="circle"
                              className="w-full h-full"
                            />
                            <div className="absolute top-0 justify-center h-full left-10 flex flex-col gap-4">
                              <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-3xl text-[#031753] font-semibold w-96"
                              >
                                {e.title}
                              </motion.p>
                              <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-mmd text-[#031753]"
                              >
                                {e.description}
                              </motion.p>
                              <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                              >
                                <Link
                                  href={e.link}
                                  className="bg-[#ECF2FF] w-fit py-3 px-10 rounded-4xl flex gap-4"
                                >
                                  <p className="text-[#084FE3] font-semibold">
                                    {t('Узнать больше')}
                                  </p>
                                  <ArrowRightAltIcon className="text-[#084FE3]" />
                                </Link>
                              </motion.div>
                            </div>
                          </motion.div>
                          <div
                            className="w-[40%] h-full overflow-hidden absolute right-0 bottom-0 rounded-4xl"
                            style={{
                              background:
                                'linear-gradient(180deg, #66BCFF 0%, #35DED5 100%)',
                            }}
                          />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, x: 50 }}
                          whileInView={{ opacity: 1, scale: 1, x: 0 }}
                          viewport={{ once: false, amount: 0.3 }}
                          transition={{ duration: 1 }}
                          className="w-[40%] h-[350px] absolute right-0 bottom-0"
                        >
                          <Image
                            src={e.image}
                            width={372}
                            height={320}
                            quality={100}
                            alt="ShoreCrop"
                            className="w-full h-full object-contain right-0 z-10 absolute top-0"
                          />
                        </motion.div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </>
      )}
      {banner && (
        <div className="custom-container mt-10 lg:hidden font-medium">
          <Carousel opts={{ loop: true, align: 'start' }}>
            <CarouselContent>
              {banner?.results.map((e) => (
                <CarouselItem key={e.id}>
                  <div className="h-[800px] w-full overflow-hidden relative rounded-4xl">
                    <div className="w-full h-[50%] max-sm:h-[60%] absolute left-0 top-0 z-10">
                      <Image
                        src={BannerCircleMobile}
                        alt="circle"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute z-20 top-10 left-4 flex flex-col gap-4">
                      <p className="text-4xl text-[#031753] font-semibold w-[90%]">
                        {e.title}
                      </p>
                      <p className="text-2xl text-[#031753] w-[95%]">
                        {e.description}
                      </p>
                      <Link
                        href={e.link}
                        className="bg-[#ECF2FF] w-fit py-3 px-5 rounded-4xl flex gap-4"
                      >
                        <p className="text-[#084FE3] font-semibold">
                          {t('Узнать больше')}
                        </p>
                        <ArrowRightAltIcon className="text-[#084FE3]" />
                      </Link>
                    </div>
                    <div
                      className="w-full h-[60%] max-sm:h-[50%] overflow-hidden absolute left-0 bottom-0 rounded-b-4xl"
                      style={{
                        background:
                          'linear-gradient(180deg, #66BCFF 0%, #35DED5 100%)',
                      }}
                    >
                      <Image
                        src={e.image}
                        width={372}
                        height={320}
                        quality={100}
                        alt="banner"
                        className="w-full h-full absolute z-10 object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </>
  );
};

export default HotTours;
