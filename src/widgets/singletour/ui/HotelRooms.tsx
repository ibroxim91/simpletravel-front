'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Bed } from 'lucide-react';

interface HotelRoomsProps {
  rooms: string[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HotelRooms({ rooms }: HotelRoomsProps) {
  const t = useTranslations();

  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={fadeInUp}
      className="mt-[72px]"
    >
      <div className="h-px w-full bg-[#11221140]" />

      <div className="mt-[72px] flex w-full max-w-[1240px] flex-col items-start gap-8">
        <h3 className="text-[20px] leading-6 font-bold text-[#112211]">
          {t('Mexmonxona xonalari')}
        </h3>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-4 rounded-[12px] border border-[#E5E7EB] bg-white hover:bg-[#F9F9F9] transition-colors"
            >
              <Bed className="h-6 w-6 text-[#1A73E8] flex-shrink-0 mt-1" />
              <p className="text-[14px] leading-[17px] font-medium text-[#112211]">
                {room}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
