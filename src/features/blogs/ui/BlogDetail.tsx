'use client';

import { Link } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { Badge } from '@/shared/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import EastIcon from '@mui/icons-material/East';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar1, PinIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { News_Api } from '../lib/api';

const BlogDetail = () => {
  const t = useTranslations();
  const { id: slug } = useParams();
  const idFromSlug = Array.isArray(slug)
    ? Number(slug[slug.length - 1].split('-').pop())
    : slug
      ? Number(slug.split('-').pop())
      : undefined;

  const { data: news, isLoading } = useQuery({
    queryKey: ['detail_news', idFromSlug],
    queryFn: () => News_Api.getNewsDetail({ id: Number(idFromSlug) }),
  });

  const { data, isLoading: isLoadingNews } = useQuery({
    queryKey: ['all_news'],
    queryFn: () => News_Api.getAllNews({ page: 1, page_size: 9 }),
  });

  const newsData = news?.data?.data;
  const allNewsData = data?.data?.data?.results;

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
        <Link href="/blogs?tab=1" className="text-[#646465] font-medium">
          {t('Блоги')}
        </Link>
        <p className="text-[#646465] font-medium">
          {t('Cтраница подробностей')}
        </p>
      </Breadcrumbs>

      <div className="custom-container mt-10 max-w-5xl">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-2/3 rounded-lg" />
            <Skeleton className="w-full h-[460px] mt-5 rounded-3xl" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            <div className="mt-10 space-y-4">
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-6 w-5/6 rounded-md" />
              <Skeleton className="h-[300px] w-full rounded-3xl" />
            </div>
          </>
        ) : (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-semibold text-2xl text-[#232325]"
            >
              {newsData?.title}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Image
                src={newsData?.image || ''}
                alt={newsData?.text || ''}
                quality={85}
                width={744}
                height={460}
                sizes="(max-width: 768px) 100vw, 744px"
                priority
                className="w-full mt-5 rounded-3xl"
              />

              <div className="mt-4 gap-10 flex items-center max-lg:flex-col max-lg:items-start max-lg:gap-2">
                <div className="flex items-center gap-2 text-[#212122] max-md:text-[12px]">
                  <Calendar1 width={24} height={24} color="#084FE3" />
                  <p>
                    {newsData &&
                      formatDate.format(newsData.created, 'DD.MM.YYYY')}
                  </p>
                </div>

                {newsData && newsData?.post_tags?.length > 0 && (
                  <div className="flex items-start gap-2 text-[#212122]">
                    <PinIcon
                      className="rotate-45 flex-shrink-0"
                      width={24}
                      height={24}
                      fill="#084FE3"
                      color="#084FE3"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      {newsData.post_tags.map((e) => (
                        <p className="w-fit break-words" key={e.id}>
                          #{e.name}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="mt-10 max-md:mt-5">
              <p className="text-[#212122] text-lg">{newsData?.text}</p>
              {newsData?.post_images?.map((item, idx) => (
                <div key={item.image}>
                  <Image
                    src={item.image}
                    alt={item.text}
                    quality={80}
                    width={500}
                    height={500}
                    sizes="(max-width: 768px) 100vw, 500px"
                    loading={idx > 0 ? 'lazy' : undefined}
                    className="w-full h-full object-contain mt-5 rounded-3xl"
                  />
                  <p className="text-[#212122] text-lg mt-5">{item.text}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="custom-container mt-10 font-medium">
        <div className="flex justify-between items-center">
          <p className="text-3xl text-[#031753] font-semibold">
            {t('Новости')}
          </p>
          <Link
            href={'/blogs'}
            className="cursor-pointer font-semibold text-blue-600 max-lg:hidden"
          >
            {t('Больше новостей')}
          </Link>
        </div>

        <Carousel className="w-full mt-4">
          <CarouselContent>
            {isLoadingNews
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <CarouselItem
                    className="flex flex-col w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[80%]"
                    key={idx}
                  >
                    <Skeleton className="w-full h-[250px] rounded-3xl" />
                    <div className="mt-3 space-y-2 px-4">
                      <Skeleton className="h-6 w-2/3 rounded-md" />
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-3xl mt-4" />
                  </CarouselItem>
                ))
              : allNewsData?.map((e, idx) => (
                  <CarouselItem
                    className="flex flex-col h-[500px] w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[80%]"
                    key={e.id}
                  >
                    <div className="bg-white rounded-3xl h-[500px]">
                      <Link
                        href={`/blogs/${e.id}`}
                        prefetch={true}
                        className="w-full flex flex-col justify-between h-full"
                      >
                        <div>
                          <div className="w-full aspect-square h-[300px] relative group overflow-hidden rounded-3xl shadow-lg">
                            <Image
                              src={e.image}
                              alt={e.short_text}
                              fill
                              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                              quality={75}
                              priority={idx < 2}
                              loading={idx >= 2 ? 'lazy' : undefined}
                              className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="flex flex-col absolute bottom-2 left-2 z-20">
                              <Badge className="bg-[#031753] px-4 py-1 rounded-4xl text-sm font-semibold">
                                {formatDate.format(e.created, 'DD.MM.YYYY')}
                              </Badge>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>

                          <div className="mt-2 flex flex-col gap-2 px-4">
                            <p className="text-xl font-semibold text-[#031753]">
                              {e.short_title}
                            </p>
                            <p className="text-md text-[#646465]">
                              {e.short_text}
                            </p>
                          </div>
                        </div>

                        <div className="w-[80%] bg-[#ECF2FF] font-semibold mt-4 mx-auto py-3 mb-3 rounded-4xl text-center text-[#084FE3] hover:bg-blue-100 transition-colors">
                          {t('Узнать больше')}
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default BlogDetail;
