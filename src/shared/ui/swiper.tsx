'use client';

import Ticket_Api from '@/widgets/selectour/lib/api';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from '../config/i18n/navigation';

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

  const fallbackImage = '/Logo_blue.png';
  const primaryImage = images?.[0]?.image || fallbackImage;

  return (
    <div className="w-full mx-auto square relative">
      <div
        className="custom-container mt-10 mb-[72px] h-[550px] max-lg:h-[320px]"
        onClick={() => setOpenWatch(true)}
      >
        <div className="relative h-full w-full rounded-[16px] overflow-hidden">
          <Image
            src={primaryImage}
            alt="Tour main image"
            fill
            quality={100}
            className="object-cover"
          />
        </div>
      </div>

      <div className="absolute right-8 top-8 z-10 flex items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-full bg-[#FFFFFF99] px-3 py-2 cursor-pointer backdrop-blur-2xl"
          onClick={() => setOpenWatch(true)}
        >
          <AspectRatioIcon sx={{ fontSize: 18 }} />
          <p className="text-[12px] text-[#1C1C1E]">{t('Обзор')}</p>
        </div>

        <div
          className="flex items-center gap-2 rounded-full bg-[#FFFFFF99] cursor-pointer backdrop-blur-2xl justify-center p-2"
          onClick={handleCopy}
        >
          <IosShareIcon sx={{ fontSize: 18 }} />
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
          className="flex items-center gap-2 rounded-full bg-[#FFFFFF99] cursor-pointer backdrop-blur-2xl justify-center p-2"
        >
          <FavoriteRoundedIcon
            sx={{ color: is_liked ? '#E03137' : '#374151', fontSize: 18 }}
          />
        </div>
      </div>
    </div>
  );
}
