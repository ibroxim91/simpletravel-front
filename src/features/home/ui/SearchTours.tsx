'use client';

import { Link } from '@/shared/config/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import EastIcon from '@mui/icons-material/East';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HotelIcon from '@mui/icons-material/Hotel';
import LuggageIcon from '@mui/icons-material/Luggage';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { getBanner } from '../lib/api';
import TabsHotel from './TabsHotel';
import TabsHotelMobile from './TabsHotelMobile';
import TabsTourMobile from './TabsTourMobile';
import TabsTours from './TabsTours';

const SearchTours = () => {
  const [active, setActive] = useState<'tours' | 'hotel'>('tours');
  const t = useTranslations();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['get_banner2'],
    queryFn: () => getBanner({ page: 1, page_size: 99, position: 'banner2' }),
    select: (data) => data.data.data,
  });

  if (isLoading) {
    return (
      <div className="mt-10 custom-container">
        <Skeleton variant="rounded" height={300} className="rounded-4xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 custom-container flex flex-col items-center justify-center">
        <Card className="p-10 text-center">
          <ErrorOutlineIcon
            className="text-red-500 mb-3"
            sx={{ fontSize: 50 }}
          />
          <p className="text-lg text-gray-700 mb-4 font-medium">
            {t('Banner yuklashda xatolik yuz berdi')}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <Button
            onClick={() => refetch()}
            className="px-6 py-2 rounded-3xl bg-[#232325] text-white hover:bg-[#333]"
          >
            {t('Qayta urinish')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] custom-container border border-[#edeef1]">
      <Carousel opts={{ loop: true, align: 'start' }} className="min-h-[60px]">
        <CarouselContent className="h-[320px] max-lg:h-[60px]">
          {data?.results.map((e, i) => (
            <CarouselItem key={i} className="basis-full">
              <div className="relative rounded-4xl">
                <div className="w-full h-[300px] overflow-hidden rounded-4xl max-lg:hidden bg-gradient-to-r from-[#084FE3] via-[#20C1F2] to-[#33AAFF] relative">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    className="absolute -right-6 h-[600px] w-[600px] -top-40 bg-white/10 rounded-full clip-half"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.3 }}
                      transition={{ duration: 0.8 }}
                      className="absolute -right-24 h-[600px] w-[600px] top-0 bg-white/20 rounded-full clip-half"
                    />
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.8 }}
                      className="absolute -right-44 h-[600px] w-[600px] top-0 bg-white/30 rounded-full clip-half"
                    >
                      <Image
                        src={e.image}
                        alt={e.image}
                        width={200}
                        height={200}
                        priority
                        fetchPriority="high"
                        quality={100}
                        unoptimized
                        className="w-[600px] h-[600px] absolute left-10 top-[5%] object-contain"
                      />
                    </motion.div>
                  </motion.div>

                  <div className="h-full px-10 flex flex-col justify-center gap-2">
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-[#FFFFFF] text-4xl font-semibold"
                    >
                      {t('Предложение дня: только сегодня!')}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-[#ECF2FF] text-xl"
                    >
                      {t('Лучшие направления по самым выгодным ценам')}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <Link
                        href={'/selectour'}
                        className="bg-white mt-5 font-semibold text-[#212122] flex gap-4 px-8 py-4 shadow-sm !rounded-4xl w-fit"
                      >
                        <p>{t('Смотреть цены')}</p>
                        <EastIcon />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                <div className="bg-[#edeef1] flex justify-center py-2 h-[40px] w-fit p-3 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full max-lg:w-full">
                  <div className="max-lg:w-full max-lg:mt-10 bg-white grid grid-cols-2 py-1 px-1 h-[50px] rounded-4xl shadow-sm">
                    <button
                      onClick={() => setActive('tours')}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-4xl font-semibold cursor-pointer transition
                ${active === 'tours' ? 'bg-[#084FE3] text-white' : 'text-black'}`}
                    >
                      <LuggageIcon />
                      <p>{t('Туры')}</p>
                    </button>

                    <button
                      onClick={() => setActive('hotel')}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-4xl font-semibold cursor-pointer transition
                ${active === 'hotel' ? 'bg-[#084FE3] text-white' : 'text-black'}`}
                    >
                      <HotelIcon />
                      <p>{t('Отели')}</p>
                    </button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <TabsTours active={active} />
      <TabsTourMobile active={active} />
      <TabsHotel active={active} />
      <TabsHotelMobile active={active} />
    </div>
  );
};

export default SearchTours;
