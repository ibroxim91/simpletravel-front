import { motion } from 'framer-motion';
import Image from 'next/image';
import TourInfoItem from '../../../../public/images/tourItem1.png';

const slideIn = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

export default function TourOffersItem() {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={slideIn}
        className="w-full h-full relative cursor-pointer rounded-2xl flex-shrink-0 max-lg:hidden"
      >
        <Image
          src={TourInfoItem.src}
          alt="tour offers"
          height={500}
          width={500}
          className="object-cover rounded-2xl"
        />

        <div className="absolute bottom-[10px] left-[10px] text-white hidden">
          <h1 className="font-bold text-[28px]">Турция</h1>
          <p className="font-semibold text-sm mt-[5px]">От $700 / 2 чел</p>
        </div>
      </motion.div>
      <div className="w-full h-full relative cursor-pointer rounded-2xl flex-shrink-0 lg:hidden">
        <Image
          src={TourInfoItem.src}
          alt="tour offers"
          height={700}
          width={700}
          className="object-cover rounded-2xl"
        />

        <div className="absolute bottom-[10px] left-[10px] text-white hidden">
          <h1 className="font-bold text-[28px]">Турция</h1>
          <p className="font-semibold text-sm mt-[5px]">От $700 / 2 чел</p>
        </div>
      </div>
    </>
  );
}
