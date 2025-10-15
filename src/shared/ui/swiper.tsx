'use client';

import Ticket_Api from '@/widgets/selectour/lib/api';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import EastIcon from '@mui/icons-material/East';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import IosShareIcon from '@mui/icons-material/IosShare';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link, useRouter } from '../config/i18n/navigation';

interface Props {
  setOpenWatch: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  is_liked: boolean;
  images: [
    {
      image: string;
    },
  ];
}

export default function ImageSwiper({
  setOpenWatch,
  images,
  id,
  is_liked,
}: Props) {
  const t = useTranslations();
  const route = useRouter();
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('URL nusxalandi', { position: 'top-center' });
      });
    }
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ ticket }: { ticket: number }) => {
      return Ticket_Api.saveTickets({ ticket });
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['ticket_all'] });
      queryClient.refetchQueries({ queryKey: ['get_saved'] });
      queryClient.refetchQueries({ queryKey: ['tickets_detail'] });
    },
    onError() {
      route.push(
        `/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`,
      );
    },
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
  return (
    <div className="w-full mx-auto square relative">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        spaceBetween={16}
        slidesPerView={1}
        className="mySwiper"
      >
        {images?.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="relative w-full h-[500px]"
              onClick={() => setOpenWatch(true)}
            >
              <Image
                src={img.image}
                alt={`Image ${idx + 1}`}
                fill
                quality={100}
                className=" object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex items-center justify-center text-white absolute top-10 w-full z-10 max-lg:flex-col">
        <div className="custom-container flex items-center justify-between max-lg:flex-col gap-4 max-lg:items-start">
          <div className="max-sm:hidden">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={<EastIcon fontSize="small" className="text-[#ffff]" />}
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  mx: 2,
                },
              }}
            >
              <Link href="/" className="font-medium text-[#ffff]">
                {t('Главная')}
              </Link>
              <Link href="/selectour" className="text-[#ffff] font-medium">
                {t('Подобрать тур')}
              </Link>
              <p className="text-[#ffff] font-medium">{t('Тур страница')}</p>
            </Breadcrumbs>
          </div>

          <div className="sm:hidden">
            <Breadcrumbs
              aria-label="breadcrumb"
              separator={<EastIcon fontSize="small" className="text-[#ffff]" />}
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  mx: 2,
                },
              }}
            >
              <Link
                href="/"
                className="font-medium text-[#ffff] max-md:text-sm"
              >
                {t('Главная страница')}
              </Link>
              <Link
                href="/selectour"
                className="text-[#ffff] font-medium max-md:text-sm"
              >
                {t('Подобрать тур')}
              </Link>
            </Breadcrumbs>
          </div>

          <div className="flex items-center gap-2 max-lg:w-full max-lg:items-end max-lg:flex-col">
            <div
              className="flex items-center gap-5 bg-[#FFFFFF33] rounded-full px-4 py-4 cursor-pointer backdrop-blur-2xl"
              onClick={() => setOpenWatch(true)}
            >
              <AspectRatioIcon />
              <p className="max-lg:hidden text-[#FFFFFF]">
                {t('Полный обзор')}
              </p>
            </div>

            <div
              className="flex items-center gap-5 bg-[#FFFFFF33] rounded-full cursor-pointer backdrop-blur-2xl justify-center px-4 py-4"
              onClick={handleCopy}
            >
              <IosShareIcon />
            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (is_liked) {
                  deletLike({
                    ticket: id,
                  });
                } else if (!is_liked) {
                  mutate({
                    ticket: id,
                  });
                }
              }}
              className="flex items-center gap-5 bg-[#FFFFFF33] rounded-full cursor-pointer backdrop-blur-2xl justify-center px-4 py-4"
            >
              <FavoriteRoundedIcon
                sx={{ color: is_liked ? '#E03137' : '#fff' }}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .square .swiper-pagination-bullet {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(25px);
          opacity: 1;
          border-radius: 27px;
          margin: 0 6px !important;
          transition:
            background 0.3s,
            border-radius 0.3s;
          border: none;
        }
        .square .swiper-pagination-bullet-active {
          background: #ffffff !important;
          backdrop-filter: none;
        }
      `}</style>
    </div>
  );
}
