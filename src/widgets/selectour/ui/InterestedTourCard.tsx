'use client';

import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface InterestedTourCardProps {
  item: any;
  locale: LanguageRoutes;
  index: number;
}

export default function InterestedTourCard({
  item,
  locale,
  index,
}: InterestedTourCardProps) {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className="h-[340px]"
    >
      <Link
        href={`/selectour/${item.slug}?from_cache=${item?.from_cache ?? ''}`}
        className="group relative block h-full overflow-hidden rounded-[14px]"
      >
        <Image
          src={BASE_URL + item.ticket_images}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-3">
          <div>
            <p className="line-clamp-1 text-2xl font-bold leading-[29px] text-white">
              {item.destination?.name || item.title}
            </p>
            <p className="mt-2 text-base font-medium leading-5 text-white">
              {t('от')} {formatPrice(item.price, locale, true)}
            </p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E5E7EB]/75 text-white">
            <ArrowForwardIcon sx={{ fontSize: 20 }} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
