'use client';

import { News_Api } from '@/features/blogs/lib/api';
import { Link } from '@/shared/config/i18n/navigation';
import formatDate from '@/shared/lib/formatDate';
import { Badge } from '@/shared/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const News = () => {
  const t = useTranslations();
  const { data, isLoading } = useQuery({
    queryKey: ['all_news'],
    queryFn: () =>
      News_Api.getAllNews({
        page: 1,
        page_size: 6,
      }),
    select(data) {
      return data.data.data;
    },
  });

  return (
    <div className="custom-container mt-10 font-medium">
      <div className="flex justify-between items-center">
        <p className="text-3xl text-[#031753] font-semibold">{t('Новости')}</p>
        <Link
          href={'/blogs'}
          className="cursor-pointer font-semibold text-[#1764FC] max-lg:hidden"
        >
          {t('Больше новостей')}
        </Link>
      </div>

      <Carousel className="w-full mt-4">
        <CarouselContent>
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <CarouselItem
                  key={idx}
                  className="flex flex-col w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[80%] shrink-0"
                >
                  <div className="w-full aspect-square h-[200px] relative overflow-hidden rounded-3xl">
                    <Skeleton className="h-full w-full rounded-3xl" />
                  </div>
                  <div className="mt-2 flex flex-col gap-2 px-4">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-2/3 rounded-md" />
                  </div>
                  <div className="flex px-8">
                    <Skeleton className="h-10 w-full mt-4 rounded-4xl" />
                  </div>
                </CarouselItem>
              ))
            : data?.results.map((e, idx) => (
                <CarouselItem
                  key={idx}
                  className="flex flex-col w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[80%] shrink-0"
                >
                  <Link
                    href={`/blogs/${e.id}`}
                    className="w-full"
                    prefetch={true}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{ duration: 0.6, delay: idx * 0.15 }}
                      className="w-full aspect-square h-[300px] relative group overflow-hidden rounded-3xl shadow-lg"
                    >
                      <Image
                        src={e.image}
                        alt={e.short_text}
                        fill
                        className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="flex flex-col absolute bottom-2 left-2 z-20">
                        <Badge
                          variant="default"
                          className="bg-[#031753] px-4 py-1 rounded-4xl text-sm font-semibold"
                        >
                          {formatDate.format(e.created, 'DD.MM.YYYY')}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{ duration: 0.6, delay: idx * 0.2 }}
                      className="mt-2 flex flex-col gap-2 px-4"
                    >
                      <p className="text-xl font-semibold text-[#031753] w-full">
                        {e.short_title}
                      </p>
                      <p className="text-md text-[#646465]">{e.short_text}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.05 }}
                      transition={{ duration: 0.5, delay: idx * 0.25 }}
                      className="flex px-8"
                    >
                      <button className="bg-[#ECF2FF] font-semibold mt-4 w-full py-3 rounded-4xl text-center text-[#084FE3] hover:bg-blue-100 transition-colors">
                        {t('Узнать больше')}
                      </button>
                    </motion.div>
                  </Link>
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default News;
