'use client';

import Ball from '@/assets/ball.png';
import Umbrerlla from '@/assets/umbrella.png';
import { Link } from '@/shared/config/i18n/navigation';
import EastIcon from '@mui/icons-material/East';
import HotelIcon from '@mui/icons-material/Hotel';
import LuggageIcon from '@mui/icons-material/Luggage';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import TabsHotel from './TabsHotel';
import TabsHotelMobile from './TabsHotelMobile';
import TabsTourMobile from './TabsTourMobile';
import TabsTours from './TabsTours';

const SearchTours = () => {
  const [active, setActive] = useState<'tours' | 'hotel'>('tours');
  const t = useTranslations();

  return (
    <div className="min-h-[500px] custom-container">
      <div className="relative rounded-4xl">
        <div className="w-full h-[300px] overflow-hidden rounded-4xl max-lg:hidden bg-gradient-to-r from-[#084FE3] via-[#20C1F2] to-[#33AAFF] relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="absolute -right-6 h-[600px] w-[600px] -top-40 bg-white/10 rounded-full clip-half"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="absolute -right-24 h-[600px] w-[600px] top-0 bg-white/20 rounded-full clip-half"
            />
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="absolute -right-44 h-[600px] w-[600px] top-0 bg-white/30 rounded-full clip-half"
            >
              <Image
                src={Ball}
                alt="ball"
                width={200}
                height={200}
                quality={100}
                unoptimized
                className="w-[40px] h-[40px] absolute -left-4 top-[42%] object-contain"
              />
              <Image
                src={Umbrerlla}
                alt="umbrerlla"
                width={200}
                height={200}
                quality={100}
                unoptimized
                className="w-[600px] h-[600px] absolute left-10 top-[5%] object-contain"
              />
            </motion.div>
          </motion.div>

          <div className="h-full px-10 flex flex-col justify-center gap-2">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white text-3xl font-semibold"
            >
              Предложение дня: только сегодня!
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 text-lg"
            >
              Лучшие направления по самым выгодным ценам
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href={'#'}
                className="bg-white mt-5 text-black flex gap-4 px-8 py-4 shadow-sm !rounded-4xl w-fit"
              >
                <p>Смотреть цены</p>
                <EastIcon />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="bg-[#edeef1] flex justify-center py-2 h-[40px] w-[300px] absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full max-lg:w-full">
          <div className="w-[250px] max-lg:w-full max-lg:mt-10 bg-white grid grid-cols-2 py-1 px-1 h-[50px] rounded-4xl shadow-sm">
            <button
              onClick={() => setActive('tours')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-4xl font-semibold cursor-pointer transition
                ${active === 'tours' ? 'bg-blue-600 text-white' : 'text-black'}`}
            >
              <LuggageIcon />
              <p>Туры</p>
            </button>

            <button
              onClick={() => setActive('hotel')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-4xl font-semibold cursor-pointer transition
                ${active === 'hotel' ? 'bg-blue-600 text-white' : 'text-black'}`}
            >
              <HotelIcon />
              <p>Отели</p>
            </button>
          </div>
        </div>
      </div>
      <TabsTours active={active} />
      <TabsTourMobile active={active} />
      <TabsHotel active={active} />
      <TabsHotelMobile active={active} />
    </div>
  );
};

export default SearchTours;
