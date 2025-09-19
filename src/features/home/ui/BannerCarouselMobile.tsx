'use client';

import Banner from '@/assets/banner.png';
import BannerCircleMobile from '@/assets/icons/BannerCircleMobile';
import { Link } from '@/shared/config/i18n/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import EastIcon from '@mui/icons-material/East';
import Image from 'next/image';

const BannerCarouselMobile = () => {
  const items = Array.from({ length: 2 });
  const colors = ['#EDF5C7', '#F5DCC7'];

  return (
    <div className="custom-container mt-10 min-lg:hidden">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {items.map((_, index) => (
            <CarouselItem key={index} className="h-[600px] relative">
              <div className="w-full h-full bg-white flex flex-col gap-0 rounded-4xl shadow-sm overflow-hidden">
                <div className="relative w-full h-[80%]">
                  <Image
                    src={Banner}
                    alt="banner"
                    priority
                    quality={100}
                    unoptimized
                    className="w-full h-full object-cover"
                    fill={false}
                  />
                </div>

                <BannerCircleMobile
                  color={colors[index % colors.length]}
                  className="w-full h-[50%] absolute bottom-0 left-1"
                />
                <div className="flex flex-col gap-3 w-[90%] z-20 absolute bottom-6 px-4 py-1">
                  <p className="text-2xl font-semibold leading-snug text-black">
                    Предложение дня: только сегодня!
                  </p>
                  <p className="text-sm text-[#212122] leading-5 font-medium">
                    Лучшие направления по самым выгодным ценам. Лучшие
                    направления по самым популярным маршрутам.
                  </p>

                  <Link
                    href={'#'}
                    className="bg-white text-black flex items-center gap-3 px-5 py-3 shadow-md rounded-full w-fit"
                    aria-label="Смотреть цены"
                  >
                    <span className="text-sm">Смотреть цены</span>
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
