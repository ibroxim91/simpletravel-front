'use client';

import Banner_2 from '@/assets/blogsBanner.png';
import Banner from '@/assets/blogsBanner_1.png';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import EastIcon from '@mui/icons-material/East';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { News_Api } from '../lib/api';

const BlogHeader = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useQuery({
    queryKey: ['get_tabs'],
    queryFn: () =>
      News_Api.getTags({
        page: 1,
        page_size: 20,
      }),
    select(data) {
      return data.data.data.results;
    },
  });

  const initialTab = searchParams.get('tab') ?? '';
  const [active, setActive] = useState(initialTab);

  useEffect(() => {
    setActive(initialTab);
  }, [initialTab]);

  const handleTabClick = (item: string) => {
    setActive(item);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', item);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="custom-container mt-5">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<EastIcon fontSize="small" className="text-[#646465]" />}
        sx={{ '& .MuiBreadcrumbs-separator': { mx: 2 } }}
      >
        <Link href="/" className="font-medium text-[#646465]">
          {t('Главная')}
        </Link>
        <Link href="/blogs?tab=" className="text-[#646465] font-medium">
          {t('Блоги')}
        </Link>
        <p className="text-[#646465] font-medium">
          {active === '' ? (
            t('Все')
          ) : (
            <>{data?.find((e) => e.id === Number(active))?.name}</>
          )}
        </p>
      </Breadcrumbs>
      <div className="w-full h-[350px] mt-10 flex relative justify-between rounded-3xl bg-gradient-to-r to-[#42B5CD] from-[#1764FC]">
        <div className="absolute top-20 left-10 flex flex-col gap-10 z-10">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-96 max-lg:w-auto text-white font-semibold">
            {t('Пресс-релизы и новости')}
          </p>
        </div>
        <Carousel
          className="absolute bottom-8 w-full px-5 sm:px-10 z-10"
          opts={{ align: 'start' }}
        >
          <CarouselContent className="gap-2 px-5 sm:px-10">
            <CarouselItem
              onClick={() => handleTabClick(String(''))}
              className={`cursor-pointer flex-none text-center font-semibold py-2 px-6 rounded-lg min-w-[100px] transition 
                ${
                  active === String('')
                    ? 'bg-white text-[#212122] font-medium'
                    : 'bg-[#FFFFFF29] text-[#EDEEF1]'
                }`}
            >
              <p className="font-semibold">{t(`Все`)}</p>
            </CarouselItem>
            {data?.map((item) => (
              <CarouselItem
                key={item.id}
                onClick={() => handleTabClick(String(item.id))}
                className={`cursor-pointer flex-none text-center font-semibold py-2 px-6 rounded-lg min-w-[100px] transition 
                ${
                  active === String(item.id)
                    ? 'bg-white text-[#212122] font-medium'
                    : 'bg-[#FFFFFF29] text-[#EDEEF1]'
                }`}
              >
                <p className="font-semibold">{item.name}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute right-0 top-0 h-full w-[60%] min-w-[500px]">
          <Image
            src={Banner}
            alt="banner_1"
            className="h-full w-full object-cover rounded-3xl"
            priority
            quality={100}
          />
          <Image
            src={Banner_2}
            alt="banner_2"
            priority
            quality={100}
            className="absolute w-[70%] max-md:w-[60%] max-[310px]:!w-[50%] h-[370px] -top-10 right-0 z-0 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
