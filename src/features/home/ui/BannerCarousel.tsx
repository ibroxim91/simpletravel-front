'use client';

import BannerCircle from '@/assets/icons/BannerCircle';
import { Link } from '@/shared/config/i18n/navigation';
import { Button } from '@/shared/ui/button'; // ✅ Retry tugmasi uchun
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import EastIcon from '@mui/icons-material/East';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Card from '@mui/material/Card';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getBanner } from '../lib/api';

const BannerCarousel = () => {
  const colors = ['#EDF5C7', '#F5DCC7'];
  const t = useTranslations();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['get_banner'],
    queryFn: () => getBanner({ page: 1, page_size: 99, position: 'banner1' }),
    select: (data) => data.data.data,
  });
  if (isLoading) {
    return (
      <div className="mt-10 max-lg:hidden custom-container">
        <div className="relative h-[500px]">
          <Card className="h-full !rounded-[50px] border-none overflow-hidden relative">
            <div className="absolute left-0 top-0 w-[60%] h-full">
              <Skeleton className="w-full h-full rounded-none" />
            </div>
            <div className="absolute right-0 top-0 w-[50%] h-full">
              <Skeleton className="w-full h-full rounded-none" />
            </div>

            <div className="absolute left-14 top-1/2 -translate-y-1/2 w-96 flex flex-col gap-6 z-20">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-48 rounded-3xl" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 max-lg:hidden custom-container">
        <div className="relative h-[500px] flex items-center justify-center">
          <Card className="h-full w-full !rounded-[50px] border-none overflow-hidden flex flex-col items-center justify-center gap-4">
            <ErrorOutlineIcon className="text-red-500" sx={{ fontSize: 60 }} />
            <p className="text-lg text-gray-800 font-semibold">
              {t('Banner yuklashda xatolik yuz berdi')}
            </p>
            <Button
              onClick={() => refetch()}
              className="px-6 py-2 rounded-3xl bg-[#232325] text-white hover:bg-[#333]"
            >
              {t('Qayta urinish')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 max-lg:hidden custom-container">
      <Carousel opts={{ loop: true, align: 'start' }}>
        <CarouselContent>
          {data?.results.map((e, index) => (
            <CarouselItem
              key={index}
              className="basis-full md:basis-[80%] shrink-0"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-[500px]"
              >
                <Card className="h-full !rounded-[50px] flex border-none items-center justify-start relative overflow-hidden">
                  <BannerCircle
                    color={colors[index % colors.length]}
                    className="w-[60%] h-full absolute z-10"
                  />

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex flex-col gap-6 w-96 z-20 absolute left-14 top-1/2 -translate-y-1/2"
                  >
                    <p className="text-4xl font-semibold text-[#232325]">
                      {e.title}
                    </p>
                    <p className="text-[#212122] font-medium">
                      {e.description}
                    </p>
                    <Link
                      href={e.link}
                      className="bg-white text-[#212122] font-semibold flex gap-4 px-8 py-4 shadow-sm !rounded-4xl w-fit"
                    >
                      <p>{t('Смотреть цены')}</p>
                      <EastIcon />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute right-0 w-[50%] h-full"
                  >
                    <Image
                      src={e.image}
                      alt="banner"
                      width={304}
                      height={312}
                      quality={100}
                      priority
                      fetchPriority="high"
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 size-10 rounded-full shadow z-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full size-10 shadow z-10" />
      </Carousel>
    </div>
  );
};

export default BannerCarousel;
