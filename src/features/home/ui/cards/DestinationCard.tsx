'use client';

import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface DestinationCardProps {
  item: any;
  index?: number;
  locale: LanguageRoutes;
  fromLabel: string;
  onClick?: () => void;
}

const DestinationCard = ({
  item,
  index = 0,
  locale,
  fromLabel,
  onClick,
}: DestinationCardProps) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, ease: 'easeOut' as const },
    }),
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      custom={index}
    >
      <Link
        href={`/selectour/${item.slug}/?from_cache=${item?.from_cache ?? ''}`}
        className="group relative block h-[340px] overflow-hidden rounded-[14px]"
        prefetch
        onClick={onClick}
      >
        <Image
          src={BASE_URL + item.ticket_images}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
          <div>
            <p className="line-clamp-1 text-2xl font-semibold leading-[29px] text-white">
              {item.destination?.name || item.title}
            </p>
            <p className="mt-2 text-base font-medium leading-5 text-white">
              {fromLabel} {formatPrice(item.price, locale, true)}
            </p>
          </div>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E5E7EB]/75 text-white">
            <ArrowForwardIcon sx={{ fontSize: 20 }} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default DestinationCard;
