import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Rating from '@mui/material/Rating';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { CalendarDays, MapPinCheckInside, Plane, User } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { TickectAllResults } from '../lib/types';

export default function TourItem({ data }: { data: TickectAllResults }) {
  const { locale } = useParams();
  return (
    <Link href={`/selectour/${data.id}`}>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: 'easeOut',
        }}
        viewport={{ once: false, amount: 0.1 }}
        className="h-[300px] max-xl:h-[350px] flex cursor-pointer relative w-full items-center mt-5 rounded-3xl bg-[#ffff] max-lg:flex-col max-lg:h-auto"
      >
        <Button
          className={clsx(
            'absolute cursor-pointer z-10 border-2 w-10 h-10 rounded-full right-4 top-5',
            data.is_liked
              ? 'bg-[#FFE4E5] border-[#E0313733] hover:bg-[#FFE4E5]'
              : 'bg-[#FFFF] border-[#DFDFDF] hover:bg-[#FFFF]',
          )}
        >
          <FavoriteRoundedIcon
            sx={{ color: data.is_liked ? '#E03137' : '#000' }}
          />
        </Button>
        <div className="h-full aspect-square rounded-3xl w-[40%] relative max-lg:w-full">
          <Image
            src={BASE_URL + data.ticket_images.image}
            alt="tour"
            className="w-full h-full object-cover rounded-3xl"
            width={500}
            height={500}
            quality={100}
          />
          <div className="flex flex-col absolute top-2 left-4 gap-2 z-20">
            {data.badge.map((e) => (
              <Badge
                key={e.id}
                variant="default"
                className={`bg-${e.color}-500 text-sm px-4 py-1 rounded-4xl font-semibold`}
              >
                {e.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="w-full p-6 h-full ">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Rating
                name="read-only"
                size="medium"
                sx={{ color: '#F08125' }}
                value={data.rating}
                readOnly
                precision={0.1}
              />
            </div>
            <h1 className="text-2xl text-[#031753] font-semibold">
              {data.title}
            </h1>
            <div className="flex items-center">
              <MapPinCheckInside
                fill="#084FE3"
                color="white"
                className="size-8"
              />
              <p className="text-[#031753]">{data.destination}</p>
            </div>
          </div>

          <ul className="px-6 text-[#646465] text-md list-disc items-center mt-5">
            {data.ticket_amenities.slice(0, 3).map((e) => (
              <li key={e.name}>{e.name}</li>
            ))}
          </ul>

          <div className="flex items-center gap-4 max-xl:flex-col mt-5 max-xl:items-start">
            <button className="bg-[#1764FC] text-white text-sm rounded-full px-4 py-4 cursor-pointer max-xl:w-full">
              {formatPrice(data.price, locale as LanguageRoutes, true)}
            </button>
            <div className="flex gap-8 items-center  text-[#646465] text-sm">
              <div className="flex gap-3 text-[12px] items-center">
                <Plane fill="#084FE3" color="#084FE3" className="size-5" />
                <p>{formatDate.format(data.departure_date, 'DD MMM')}</p>
              </div>
              <ul className="flex items-center text-[12px] gap-8 text-center">
                <li className="flex items-center gap-2">
                  <User color="#1764FC" className="size-5" />
                  {data.passenger_count}
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays color="#1764FC" className="size-5" />
                  {data.duration_days}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
