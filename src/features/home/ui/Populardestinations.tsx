'use client';

import BannerCircle from '@/assets/divCircle.png';
import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getBanner } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.2, ease: 'easeOut' as const },
  }),
};

const SkeletonCard = ({ className }: { className: string }) => (
  <div className={`${className} rounded-3xl bg-gray-200 animate-pulse`}>
    <div className="absolute bottom-10 left-4 space-y-2">
      <div className="w-40 h-6 bg-gray-300 rounded" />
      <div className="w-32 h-4 bg-gray-300 rounded" />
    </div>
  </div>
);

const Populardestinations = () => {
  const { locale } = useParams();
  const t = useTranslations();
  const { data: ticket, isLoading } = useQuery({
    queryKey: ['ticket_popular'],
    queryFn: () =>
      Ticket_Api.GetAllTickets({
        params: {
          page: 1,
          page_size: 6,
          featured_tickets: true,
        },
      }),
    select(data) {
      return data.data.results.tickets;
    },
  });

  const {
    data: banner,
    isLoading: bannerLoad,
    isError: bannerError,
    refetch,
  } = useQuery({
    queryKey: ['get_banner3'],
    queryFn: () => getBanner({ page: 1, page_size: 99, position: 'banner3' }),
    select: (data) => data.data.data,
  });
  return (
    <div className="custom-container mt-10 max-lg:hidden">
      <div className="flex justify-between items-center">
        <p className="text-3xl font-semibold text-[#031753]">
          {t('Популярные направления')}
        </p>
        <Link
          href="/selectour"
          className="cursor-pointer text-[#1764FC] font-semibold text-lg"
        >
          {t('Больше акций')}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex mt-4 gap-5 h-[700px] font-medium">
          <SkeletonCard className="w-[30%] h-[700px] relative" />
          <div className="grid grid-rows-2 w-full gap-4">
            <div className="w-full flex h-full gap-4">
              <SkeletonCard className="w-[30%] relative" />
              <SkeletonCard className="w-[70%] relative" />
            </div>
            <div className="w-full flex h-full gap-4">
              <SkeletonCard className="w-[70%] relative" />
              <SkeletonCard className="w-[30%] relative" />
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          className="flex mt-4 gap-5 h-[700px] font-medium"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="w-[30%] rounded-3xl h-[700px] relative group overflow-hidden"
          >
            {ticket && ticket[0] && (
              <Link
                href={`/selectour/${ticket[0].id}`}
                className="block relative w-full h-full"
                prefetch={true}
              >
                <Image
                  src={BASE_URL + ticket[0].ticket_images}
                  alt={ticket[0].title}
                  fill
                  sizes="(max-width: 1920px) 100vw, 33vw"
                  quality={100}
                  className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <RemoveRedEyeOutlinedIcon
                    className="text-white"
                    sx={{ width: '60px', height: '60px' }}
                  />
                </div>
                <div className="absolute bottom-10 left-4 transition-all duration-500 group-hover:translate-y-[-4px] group-hover:scale-105">
                  <p className="text-white text-2xl font-semibold">
                    {ticket[0].title}
                  </p>
                  <p className="text-white text-sm">
                    {formatPrice(
                      ticket[0].price,
                      locale as LanguageRoutes,
                      true,
                    )}{' '}
                    / {ticket[0].passenger_count} {t('чел')}
                  </p>
                </div>
              </Link>
            )}
          </motion.div>

          <div className="grid grid-rows-2 w-full gap-4">
            <div className="w-full flex h-full rounded-3xl gap-4">
              <motion.div
                variants={fadeUp}
                custom={1}
                className="w-[30%] rounded-3xl relative group overflow-hidden"
              >
                {ticket && ticket[1] && (
                  <Link
                    href={`/selectour/${ticket[1].id}`}
                    prefetch={true}
                    className="block relative w-full h-full"
                  >
                    <Image
                      src={BASE_URL + ticket[1].ticket_images}
                      alt={ticket[1].title}
                      fill
                      sizes="(max-width: 1920px) 100vw, 33vw"
                      quality={100}
                      className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <RemoveRedEyeOutlinedIcon
                        className="text-white"
                        sx={{ width: '60px', height: '60px' }}
                      />
                    </div>
                    <div className="absolute bottom-10 left-4">
                      <p className="text-white text-2xl font-semibold">
                        {ticket[1].title}
                      </p>
                      <p className="text-white text-sm">
                        {formatPrice(
                          ticket[1].price,
                          locale as LanguageRoutes,
                          true,
                        )}{' '}
                        / {ticket[1].passenger_count} {t('чел')}
                      </p>
                    </div>
                  </Link>
                )}
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={2}
                className="w-[70%] rounded-3xl relative group overflow-hidden"
              >
                {ticket && ticket[2] && (
                  <Link
                    href={`/selectour/${ticket[2].id}`}
                    prefetch={true}
                    className="block relative w-full h-full"
                  >
                    <Image
                      src={BASE_URL + ticket[2].ticket_images}
                      alt={ticket[2].title}
                      fill
                      sizes="(max-width: 1920px) 100vw, 33vw"
                      quality={100}
                      className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <RemoveRedEyeOutlinedIcon
                        className="text-white"
                        sx={{ width: '60px', height: '60px' }}
                      />
                    </div>
                    <div className="absolute bottom-10 left-4">
                      <p className="text-white text-2xl font-semibold">
                        {ticket[2].title}
                      </p>
                      <p className="text-white text-sm">
                        {formatPrice(
                          ticket[2].price,
                          locale as LanguageRoutes,
                          true,
                        )}{' '}
                        / {ticket[2].passenger_count} {t('чел')}
                      </p>
                    </div>
                  </Link>
                )}
              </motion.div>
            </div>
            <div className="w-full flex h-full rounded-3xl gap-4">
              <motion.div
                variants={fadeUp}
                custom={3}
                className="w-[70%] rounded-3xl relative group overflow-hidden"
              >
                {ticket && ticket[3] && (
                  <Link
                    href={`/selectour/${ticket[3].id}`}
                    prefetch={true}
                    className="block relative w-full h-full"
                  >
                    <Image
                      src={BASE_URL + ticket[3].ticket_images}
                      alt={ticket[3].title}
                      fill
                      sizes="(max-width: 1920px) 100vw, 33vw"
                      quality={100}
                      className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <RemoveRedEyeOutlinedIcon
                        className="text-white"
                        sx={{ width: '60px', height: '60px' }}
                      />
                    </div>
                    <div className="absolute bottom-10 left-4">
                      <p className="text-white text-2xl font-semibold">
                        {ticket[3].title}
                      </p>
                      <p className="text-white text-sm">
                        {formatPrice(
                          ticket[3].price,
                          locale as LanguageRoutes,
                          true,
                        )}{' '}
                        / {ticket[3].passenger_count} {t('чел')}
                      </p>
                    </div>
                  </Link>
                )}
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="w-[30%] rounded-3xl relative group overflow-hidden"
              >
                {ticket && ticket[4] && (
                  <Link
                    href={`/selectour/${ticket[4].id}`}
                    prefetch={true}
                    className="block relative w-full h-full"
                  >
                    <Image
                      src={BASE_URL + ticket[4].ticket_images}
                      alt={ticket[4].title}
                      fill
                      sizes="(max-width: 1920px) 100vw, 33vw"
                      quality={100}
                      className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/15 group-hover:bg-black/50 transition-colors duration-500 rounded-3xl" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <RemoveRedEyeOutlinedIcon
                        className="text-white"
                        sx={{ width: '60px', height: '60px' }}
                      />
                    </div>
                    <div className="absolute bottom-10 left-4">
                      <p className="text-white text-2xl font-semibold">
                        {ticket[4].title}
                      </p>
                      <p className="text-white text-sm">
                        {formatPrice(
                          ticket[4].price,
                          locale as LanguageRoutes,
                          true,
                        )}{' '}
                        / {ticket[4].passenger_count} {t('чел')}
                      </p>
                    </div>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      {bannerLoad && (
        <div className="custom-container mt-20 max-lg:hidden">
          <Card className="rounded-4xl border border-border bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center h-[400px] gap-6">
              <Skeleton className="w-full h-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {bannerError && (
        <div className="custom-container mt-20 max-lg:hidden">
          <Card className="rounded-4xl border border-destructive/30 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center h-[400px] gap-5 text-center px-6">
              <AlertTriangle className="w-14 h-14 text-destructive" />
              <div>
                <p className="text-destructive font-semibold text-lg mb-1">
                  {t('Ошибка загрузки')}
                </p>
              </div>
              <Button
                onClick={() => refetch}
                variant="destructive"
                className="rounded-full px-6 py-2"
              >
                {t('Попробовать снова')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {banner && banner.results.length > 0 && (
        <div className="custom-container mt-20 max-lg:hidden">
          <Carousel opts={{ loop: true, align: 'start' }}>
            <CarouselContent>
              {banner.results.map((e) => (
                <CarouselItem className="basis-full" key={e.id}>
                  <div className="w-full h-[400px] relative flex rounded-4xl font-medium">
                    <div className="h-[400px] w-full overflow-hidden relative rounded-4xl">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-[70%] h-[400px] z-10 absolute left-0 bottom-0 max-xl:w-[60%]"
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
                            className="text-xl text-[#031753] w-[80%]"
                          >
                            {e.description}
                          </motion.p>

                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Link
                                href={e.link}
                                className="bg-[#ECF2FF] w-fit py-4 px-10 rounded-4xl flex gap-4 shadow-md"
                              >
                                <p className="text-[#084FE3] font-semibold">
                                  {t('Забронировать')}
                                </p>
                                <ArrowRightAltIcon className="text-[#084FE3]" />
                              </Link>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: false, amount: 0.2 }}
                        className="w-[40%] h-[500px] rounded-4xl max-xl:w-[50%] overflow-hidden absolute right-0 bottom-0"
                      >
                        <Image
                          src={e.image}
                          alt="Shore"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover right-0 absolute top-12"
                        />
                      </motion.div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default Populardestinations;
