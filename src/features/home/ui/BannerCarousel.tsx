'use client';

import Banner from '@/assets/banner.png';
import BannerCircle from '@/assets/icons/BannerCircle';
import { Link } from '@/shared/config/i18n/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';
import EastIcon from '@mui/icons-material/East';
import Card from '@mui/material/Card';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const BannerCarousel = () => {
  const items = Array.from({ length: 4 });
  const colors = ['#EDF5C7', '#F5DCC7'];
  const t = useTranslations();

  return (
    <div className="mt-10 max-lg:hidden custom-container">
      <Carousel opts={{ loop: true, align: 'start' }}>
        <CarouselContent>
          {items.map((_, index) => (
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
                    <p className="text-4xl font-semibold">
                      {t('Предложение дня: только сегодня!')}
                    </p>
                    <p className="text-[#212122] font-medium">
                      {t('Лучшие направления по самым выгодным ценам')}
                    </p>
                    <Link
                      href="/selectour"
                      className="bg-white text-black font-semibold flex gap-4 px-8 py-4 shadow-sm !rounded-4xl w-fit"
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
                      src={Banner}
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
