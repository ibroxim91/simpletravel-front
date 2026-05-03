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
import Image from 'next/image';
import { useTranslations } from 'next-intl';

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
  index: _index = 0,
  locale,
  onClick,
  fallbackHotelText,
  fallbackDurationText,
  starsText,
}: TourOfferCardProps) => {
  const t = useTranslations();
  const oldPrice = Math.round(Number(item.price || 0) * 1.23);

  return (
    <div>
      <Link
        href={`/selectour/${item.slug}/?from_cache=${item?.from_cache ?? ''}`}
        prefetch
        className="group flex h-[356px] w-full flex-col rounded-[14px] bg-white p-0 md:h-auto md:border md:border-[#E5E7EB] xl:h-120.75"
        onClick={onClick}
      >
                <div className="relative h-[153px] w-full overflow-hidden rounded-[14px] sm:h-[210px] xl:h-[233px]">
                  <Image
                    src={BASE_URL + item.ticket_images}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 z-10">
                    <span className="inline-flex h-[23px] items-center rounded-[14px] bg-[#FF6B00] px-2 text-[12px] font-medium text-white">
                      -30%
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 px-0 pb-0 pt-2 text-left sm:gap-4 sm:px-4 sm:pb-4 sm:pt-4 xl:h-[209px]">
                  <div className="flex flex-col">
                    <p className="min-h-[60px] overflow-hidden text-[16px] font-bold leading-5 text-black [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:min-h-10 sm:[-webkit-line-clamp:2]">
                      {item.title}
                    </p>
                    <p className="text-[12px] font-normal leading-[15px] text-[#6B7280]">
                      {item.duration_days} {t('дней')}
                    </p>
                  </div>

                  <div className="space-y-1 text-[12px] font-medium text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <FmdGoodOutlinedIcon sx={{ fontSize: 16, color: '#1A73E8' }} />
                      <span className="block min-w-0 truncate">
                        {item.destination?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BusinessIcon sx={{ fontSize: 16, color: '#1A73E8' }} />
                      <span className="block min-w-0 truncate">
                        {item.ticket_hotel?.[0]?.name  || fallbackHotelText}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon sx={{ fontSize: 16, color: '#1A73E8' }} />
                      <span className="block min-w-0 truncate">
                       {/^\d/.test(String(item.ticket_hotel[0].rating))
                        ? `${item.ticket_hotel[0].rating} ${t('звёзды')}`
                        : item.ticket_hotel[0].rating}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-[12px] leading-[15px] text-[#F59E0B] line-through">
                        {formatPrice(oldPrice, locale, true)}
                      </p>
                      <p className="text-[14px] font-bold leading-[17px] text-[#1C1C1E]">
                        {formatPrice(item.price, locale, true)}
                      </p>
                    </div>
                    <span className="hidden h-9 w-9 place-items-center rounded-full bg-[#E5E7EB]/80 text-white md:grid">
                      <ArrowRightAltIcon sx={{ fontSize: 20 }} />
                    </span>
                  </div>
                </div>
      </Link>
    </div>
  );
};

export default TourOfferCard;
