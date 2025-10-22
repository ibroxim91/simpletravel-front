'use client';

import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import EastIcon from '@mui/icons-material/East';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Rating from '@mui/material/Rating';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, Variants } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Get_Likes_Api } from '../lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const MyFavourite = () => {
  const { locale } = useParams();
  const t = useTranslations();
  const router = useRouter();
  const [hot, setHot] = useState<CarouselApi>();
  const [hotScrollNext, setHotScrollNext] = useState(false);
  const [hotScrollPrev, setHotScrollPrev] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const { data, isLoading } = useQuery({
    queryKey: ['get_saved', currentPage],
    queryFn: () =>
      Get_Likes_Api.getAllSavedProduct({
        page: currentPage,
        page_size: itemsPerPage,
      }),
  });

  const { data: hotTicket, isLoading: hotLoading } = useQuery({
    queryKey: ['ticket_hot'],
    queryFn: () =>
      Ticket_Api.GetAllTickets({
        params: {
          page: 1,
          page_size: 8,
          rating: 3.3,
        },
      }),
  });

  const { mutate: deletLike } = useMutation({
    mutationFn: ({ ticket }: { ticket: number }) => {
      return Ticket_Api.removeTickets({ id: ticket });
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['ticket_all'] });
      queryClient.refetchQueries({ queryKey: ['get_saved'] });
      queryClient.refetchQueries({ queryKey: ['tickets_detail'] });
    },
    onError(error: { message: string }) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.message,
        position: 'bottom-right',
      });
    },
  });

  useEffect(() => {
    setCurrentPage(Number(page) || 1);
  }, [page]);

  useEffect(() => {
    if (!hot) return;

    const updateButtons = () => {
      setHotScrollNext(hot.canScrollNext());
      setHotScrollPrev(hot.canScrollPrev());
    };

    updateButtons();
    hot.on('select', updateButtons);
  }, [hot]);

  const rows = [];
  if (data?.data.data.results) {
    for (let i = 0; i < data.data.data.results.length; i += 4) {
      rows.push(data.data.data.results.slice(i, i + 4));
    }
  }

  const handleTabClick = (item: number) => {
    setCurrentPage(item);
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(item));
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
        <p className="text-[#646465] font-medium">{t('Избранное')}</p>
      </Breadcrumbs>

      {isLoading ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex flex-col w-auto">
              <div className="w-full aspect-square relative overflow-hidden rounded-3xl shadow-lg">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.data.data.results.length > 0 ? (
        <div className="mt-10">
          <p className="text-3xl font-semibold text-[#031753]">
            {t('Избранное')}
          </p>

          <div className="flex flex-col gap-6 mt-5">
            {rows.map((row, rowIdx) => (
              <div
                key={`${currentPage}-${rowIdx}`}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
              >
                {row.map((e, idx) => (
                  <motion.div
                    key={e.id + idx}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex flex-col w-auto"
                  >
                    <Link
                      href={`/selectour/${e.ticket.id}`}
                      className="w-full aspect-square relative group overflow-hidden rounded-3xl shadow-lg"
                    >
                      <Image
                        src={BASE_URL + e.ticket.ticket_images}
                        alt={e.ticket.title}
                        fill
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="flex flex-col absolute top-2 left-4 gap-2 z-20">
                        {e.ticket.badge.map((b) => (
                          <Badge
                            key={b.id}
                            variant="destructive"
                            className={`bg-[${b.color}] text-sm px-4 py-1 rounded-4xl font-semibold`}
                          >
                            {b.name}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        onClick={(btn) => {
                          btn.preventDefault();
                          btn.stopPropagation();
                          deletLike({
                            ticket: e.ticket.id,
                          });
                        }}
                        className="absolute bg-[#FFE4E5] border-[#E0313733] cursor-pointer z-20 hover:bg-[#FFE4E5] border-2 w-10 h-10 rounded-full right-4 top-2"
                      >
                        <FavoriteRoundedIcon sx={{ color: '#E03137' }} />
                      </Button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    </Link>

                    <div className="mt-4">
                      <Rating
                        name="read-only"
                        size="medium"
                        sx={{ color: '#F08125' }}
                        value={e.ticket.rating}
                        readOnly
                      />
                      <p className="text-xl font-semibold text-[#031753]">
                        {e.ticket.title}
                      </p>
                      <p className="text-sm text-[#031753]">
                        {e.ticket.destination}
                      </p>
                      <p className="mt-2 text-[#084FE3] font-semibold">
                        {formatPrice(
                          e.ticket.price,
                          locale as LanguageRoutes,
                          true,
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              className="cursor-pointer"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handleTabClick(currentPage - 1)}
            >
              <ChevronLeftIcon />
            </Button>

            {Array.from({ length: data.data.data.total_pages }).map((_, i) => (
              <Button
                key={i}
                onClick={() => handleTabClick(i + 1)}
                className="cursor-pointer"
                variant={currentPage === i + 1 ? 'default' : 'outline'}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              disabled={currentPage === data.data.data.total_pages}
              className="cursor-pointer"
              onClick={() => handleTabClick(currentPage + 1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="mt-10"
        >
          <motion.p
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="text-3xl font-semibold text-[#0E0B0E]"
          >
            {t('Тут ничего нет')}...
          </motion.p>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={itemVariants}
            className="text-3xl font-semibold text-[#084FE3]"
          >
            {t('Выберите понравивщися тур')}
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={containerVariants}
            className="grid grid-cols-3 mt-5 rounded-2xl gap-5 max-lg:grid-cols-1"
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={itemVariants}
              className="bg-white flex items-center rounded-2xl gap-4 p-4"
            >
              <HomeRoundedIcon
                sx={{ width: '60px', height: '60px', color: '#084FE3' }}
              />
              <p className="text-[#212122] font-semibold text-lg">
                {t('Найдите понравивщися тур на сайте simple travel')}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={itemVariants}
              className="bg-white flex items-center rounded-2xl gap-4 p-4"
            >
              <FavoriteRoundedIcon
                sx={{ width: '60px', height: '60px', color: '#084FE3' }}
              />
              <p className="text-[#212122] font-semibold text-lg">
                {t('Добавьте тур в избранное, нажав кнопку сохранить')}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              className="bg-white flex items-center rounded-2xl gap-4 p-4"
            >
              <PersonRoundedIcon
                sx={{ width: '60px', height: '60px', color: '#084FE3' }}
              />
              <p className="text-[#212122] font-semibold text-lg">
                {t('Зайди в свой профиль и оформите тур')}
              </p>
            </motion.div>
          </motion.div>

          <div className="custom-container mt-20">
            <div className="flex justify-between items-center">
              <Link
                href="/selectour"
                className="text-3xl text-[#031753] font-semibold"
              >
                {t('Горящие туры')}
              </Link>
              <div className="flex gap-4">
                <Button
                  variant={'outline'}
                  className="rounded-full w-10 h-10 max-lg:hidden"
                  onClick={() => hot?.scrollPrev()}
                  disabled={!hotScrollPrev}
                >
                  <KeyboardBackspaceIcon sx={{ color: '#084FE3' }} />
                </Button>
                <Button
                  variant={'outline'}
                  className="rounded-full w-10 h-10 max-lg:hidden"
                  onClick={() => hot?.scrollNext()}
                  disabled={!hotScrollNext}
                >
                  <KeyboardBackspaceIcon
                    sx={{ rotate: '180deg', color: '#084FE3' }}
                  />
                </Button>
              </div>
            </div>

            <Carousel className="w-full mt-4 cursor-pointer" setApi={setHot}>
              <CarouselContent>
                {hotLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <CarouselItem
                        key={idx}
                        className="flex flex-col w-auto basis-1/4 max-lg:basis-1/3 max-md:basis-[70%] shrink-0"
                      >
                        <div className="w-full aspect-square relative overflow-hidden rounded-3xl shadow-lg">
                          <Skeleton className="w-full h-full" />
                        </div>
                        <div className="mt-4 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </CarouselItem>
                    ))
                  : hotTicket?.data.results.tickets.map((e, idx) => (
                      <CarouselItem
                        key={idx}
                        className="flex flex-col w-auto basis-1/4 max-lg:basis-1/3 max-md:basis-[70%] shrink-0 font-medium"
                      >
                        <Link href={`/selectour/${e.id}`}>
                          <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{
                              duration: 0.6,
                              delay: idx * 0.15,
                              ease: 'easeOut',
                            }}
                            className="w-full aspect-square relative group overflow-hidden rounded-3xl shadow-lg"
                          >
                            <Image
                              src={BASE_URL + e.ticket_images}
                              alt={e.title}
                              fill
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="flex flex-col absolute top-2 left-4 gap-2 z-20">
                              {e.badge.map((e) => (
                                <Badge
                                  key={e.id}
                                  variant="default"
                                  className={`bg-[${e.color}] text-sm px-4 py-1 rounded-4xl font-semibold`}
                                >
                                  {e.name}
                                </Badge>
                              ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.1 }}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            className="mt-4"
                          >
                            <Rating
                              name="read-only"
                              size="medium"
                              value={e.rating}
                              readOnly
                              sx={{ color: '#F08125' }}
                              precision={0.1}
                            />
                            <p className="text-xl font-semibold text-[#031753]">
                              {e.title}
                            </p>
                            <p className="text-md text-[#031753]">
                              {e.destination}
                            </p>
                            <p className="mt-2 text-[#084FE3] font-semibold">
                              {formatPrice(
                                e.price,
                                locale as LanguageRoutes,
                                true,
                              )}
                            </p>
                          </motion.div>
                        </Link>
                      </CarouselItem>
                    ))}
              </CarouselContent>
            </Carousel>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyFavourite;
