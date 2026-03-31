'use client';

import BannerCircleMobile from '@/assets/icons/BannerCircleMobile';
import { Link } from '@/shared/config/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import EastIcon from '@mui/icons-material/East';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getBanner } from '../lib/api';

const BannerCarouselMobile = () => {
  const t = useTranslations();
  const colors = ['#EDF5C7', '#F5DCC7'];

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['get_banner_mobile'],
    queryFn: () => getBanner({ page: 1, page_size: 99, position: 'banner1' }),
    select: (data) => data.data.data,
  });

  if (isLoading) {
    return (
      <div className="custom-container mt-5 min-lg:hidden">
        <Card className="w-full h-[600px] rounded-4xl overflow-hidden shadow-sm relative">
          <div className="w-full h-[50%]">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[60%]">
            <Skeleton className="w-full h-full rounded-none" />
          </div>
          <div className="absolute bottom-20 left-4 flex flex-col gap-4 w-[90%] z-20">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="custom-container mt-5 min-lg:hidden flex items-center justify-center h-[600px]">
        <Card className="flex flex-col items-center justify-center gap-4 w-full h-full rounded-4xl shadow-md">
          <ErrorOutlineIcon className="text-red-500" sx={{ fontSize: 60 }} />
          <p className="text-lg font-semibold text-gray-800">
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
    );
  }

  return (
    <div className="custom-container mt-5 min-lg:hidden">
      <Carousel opts={{ loop: true }}>
        <CarouselContent className="h-[610px]">
          {data && data.results.length > 0 ? (
            data.results.map((e, index) => (
              <CarouselItem key={index} className="h-[600px] relative">
                <div className="w-full h-full bg-white flex flex-col gap-0 rounded-4xl shadow-sm overflow-hidden relative">
                  <div className="relative w-full h-[50%]">
                    <Image
                      src={e.image}
                      alt="banner"
                      priority
                      quality={100}
                      unoptimized
                      fetchPriority="high"
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[60%] overflow-hidden">
                    <BannerCircleMobile
                      color={colors[index % colors.length]}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-[90%] z-20 absolute bottom-20 max-md:bottom-5 px-4 py-1">
                    <p className="text-3xl font-semibold leading-snug text-[#232325]">
                      {e.title}
                    </p>
                    <p className="text-lg text-[#212122] leading-5 font-medium">
                      {e.description}
                    </p>

                    <Link
                      href={e.link}
                      className="bg-white text-[#212122] flex items-center gap-3 px-5 py-3 shadow-md rounded-full w-fit font-semibold"
                      aria-label="Смотреть цены"
                    >
                      <span className="text-sm text-[#212122]">
                        {t('Смотреть цены')}
                      </span>
                      <EastIcon fontSize="small" />
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="flex items-center justify-center h-[600px]">
              <p className="text-gray-500">{t('Banner mavjud emas')}</p>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BannerCarouselMobile;
