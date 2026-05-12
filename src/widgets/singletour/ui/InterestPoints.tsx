'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';

interface InterestPoint {
  name: string;
  distance?: string;
}

interface InterestPointsProps {
  points: InterestPoint[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function InterestPoints({ points }: InterestPointsProps) {
  const t = useTranslations();

  if (!points || points.length === 0) {
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
          {t('Qiziqarli joylar')}
        </h3>

        <div className="w-full flex flex-col gap-4">
          {points.map((point, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="flex items-start gap-4 p-4 rounded-[12px] border border-[#E5E7EB] bg-gradient-to-r from-white to-[#F9F9F9]"
            >
              <MapPin className="h-6 w-6 text-[#1A73E8] flex-shrink-0 mt-1" />
              <p className="text-[14px] leading-[17px] font-medium text-[#112211]">
                {point.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
