'use client';

import Banner from '@/assets/banner.png';
import BannerCircleMobile from '@/assets/icons/BannerCircleMobile';
import { Link } from '@/shared/config/i18n/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import EastIcon from '@mui/icons-material/East';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const BannerCarouselMobile = () => {
  const t = useTranslations();
  const items = Array.from({ length: 2 });
  const colors = ['#EDF5C7', '#F5DCC7'];

  return (
    <div className="custom-container mt-5 min-lg:hidden">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {items.map((_, index) => (
            <CarouselItem key={index} className="h-[600px] relative">
              <div className="w-full h-full bg-white flex flex-col gap-0 rounded-4xl shadow-sm overflow-hidden relative">
                <div className="relative w-full h-[50%]">
                  <Image
                    src={Banner}
                    alt="banner"
                    priority
                    quality={100}
                    unoptimized
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                    fill={false}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[60%] overflow-hidden">
                  <BannerCircleMobile
                    color={colors[index % colors.length]}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex flex-col gap-3 w-[90%] z-20 absolute bottom-20 max-md:bottom-5 px-4 py-1">
                  <p className="text-3xl font-semibold leading-snug text-black">
                    {t('Предложение дня: только сегодня!')}
                  </p>
                  <p className="text-lg text-[#212122] leading-5 font-medium">
                    {t('Лучшие направления по самым выгодным ценам')}
                  </p>

                  <Link
                    href={'/selectour'}
                    className="bg-white text-black flex items-center gap-3 px-5 py-3 shadow-md rounded-full w-fit font-semibold"
                    aria-label="Смотреть цены"
                  >
                    <span className="text-sm">{t('Смотреть цены')}</span>
                    <EastIcon fontSize="small" />
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BannerCarouselMobile;
