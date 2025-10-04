import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { formatPrice } from '@/shared/lib/formatPrice';
import { TickectAllResults } from '@/widgets/selectour/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

const slideIn = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

export default function TourOffersItem({ data }: { data: TickectAllResults }) {
  return (
    <Link href={`/selectour/${data.id}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={slideIn}
        className="w-full h-full relative cursor-pointer rounded-2xl flex-shrink-0 max-lg:hidden"
      >
        <Image
          src={BASE_URL + data.ticket_images.image}
          alt="tour offers"
          height={500}
          width={500}
          className="object-cover w-full h-[400px] rounded-2xl"
        />

        <div className="absolute bottom-[10px] left-[10px] text-white">
          <h1 className="font-semibold text-2xl">{data.title}</h1>
          <p className="font-medium text-sm mt-[5px]">
            От {formatPrice(data.price)} / {data.passenger_count} чел
          </p>
        </div>
      </motion.div>
      <div className="w-full h-full relative cursor-pointer rounded-2xl flex-shrink-0 lg:hidden">
        <Image
          src={BASE_URL + data.ticket_images.image}
          alt="tour offers"
          height={500}
          width={500}
          className="object-cover w-full h-[400px] rounded-2xl"
        />

        <div className="absolute bottom-[10px] left-[10px] text-white">
          <h1 className="font-semibold text-2xl">{data.title}</h1>
          <p className="font-medium text-sm mt-[5px]">
            От {formatPrice(data.price)} / {data.passenger_count} чел
          </p>
        </div>
      </div>
    </Link>
  );
}
