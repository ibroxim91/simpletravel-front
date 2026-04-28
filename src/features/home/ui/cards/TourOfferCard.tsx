'use client';

import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Badge } from '@/shared/ui/badge';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import BusinessIcon from '@mui/icons-material/Business';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import StarIcon from '@mui/icons-material/Star';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface TourOfferCardProps {
  item: any;
  index?: number;
  locale: LanguageRoutes;
  onClick?: () => void;
  fallbackHotelText: string;
  fallbackDurationText: string;
  starsText: string;
}

const 
TourOfferCard = ({
  item,
  index = 0,
  locale,
  onClick,
  fallbackHotelText,
  fallbackDurationText,
  starsText,
}: TourOfferCardProps) => {
  const t = useTranslations();
  const [enableAnimation, setEnableAnimation] = useState(false);
  const oldPrice = Math.round(Number(item.price || 0) * 1.23);
  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, ease: 'easeOut' as const },
    }),
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const syncAnimationMode = () => setEnableAnimation(mediaQuery.matches);
    syncAnimationMode();
    mediaQuery.addEventListener('change', syncAnimationMode);
    return () => mediaQuery.removeEventListener('change', syncAnimationMode);
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      initial={enableAnimation ? 'hidden' : false}
      animate={enableAnimation ? undefined : 'visible'}
      whileInView={enableAnimation ? 'visible' : undefined}
      viewport={enableAnimation ? { once: false, amount: 0.2 } : undefined}
      custom={index}
    >
      <Link
        href={`/selectour/${item.slug}/?from_cache=${item?.from_cache ?? ''}`}
        prefetch
        className="group flex w-full flex-col rounded-[14px] border border-[#E5E7EB] bg-white p-0 xl:h-120.75"
        onClick={onClick}
      >
                <div className="relative h-[190px] w-full overflow-hidden rounded-[14px] sm:h-[210px] xl:h-[233px]">
                  <Image
                    src={BASE_URL + item.ticket_images}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 z-10">
                    <span className="inline-flex h-[27px] items-center rounded-[14px] bg-[#FF6B00] px-2 text-sm font-medium text-white">
                      -30%
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 px-4 pb-4 pt-4 text-left sm:gap-4 xl:h-[209px]">
                  <div className="flex flex-col">
                    <p className="min-h-10 overflow-hidden text-base font-bold leading-5 text-black [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {item.title}
                    </p>
                    <p className="text-sm font-medium text-[#6B7280]">
                      {item.duration_days} {t('дней')}
                    </p>
                  </div>

                  <div className="space-y-1 text-sm font-medium text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <FmdGoodOutlinedIcon sx={{ fontSize: 24, color: '#1A73E8' }} />
                      <span className="block min-w-0 truncate">
                        {item.destination?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BusinessIcon sx={{ fontSize: 24, color: '#1A73E8' }} />
                      <span className="block min-w-0 truncate">
                        {item.ticket_hotel?.[0]?.name  || fallbackHotelText}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon sx={{ fontSize: 24, color: '#1A73E8' }} />
                      <span className="block min-w-0 truncate">
                       {/^\d/.test(String(item.ticket_hotel[0].rating))
                        ? `${item.ticket_hotel[0].rating} ${t('звёзды')}`
                        : item.ticket_hotel[0].rating}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-sm leading-4 text-[#F59E0B] line-through">
                        {formatPrice(oldPrice, locale, true)}
                      </p>
                      <p className="text-[16px] font-bold leading-5 text-[#1C1C1E]">
                        {formatPrice(item.price, locale, true)}
                      </p>
                    </div>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E5E7EB]/80 text-white">
                      <ArrowRightAltIcon sx={{ fontSize: 20 }} />
                    </span>
                  </div>
                </div>
      </Link>
    </motion.div>
  );
};

export default TourOfferCard;
