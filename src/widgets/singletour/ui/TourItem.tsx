import { motion } from 'framer-motion';
import Image from 'next/image';
import Tour1 from '../../../../public/images/Tour1.png';

const slideIn = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.5 },
  }),
};

export default function TourItem() {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={slideIn}
        className="cursor-pointer max-lg:hidden"
      >
        <div className="w-full aspect-square relative rounded-2xl">
          <Image src={Tour1.src} fill alt={Tour1.src} />
        </div>
        <div className="mt-[10px]">
          <h1 className="text-[20px] font-bold text-[#031753]">
            Проживание в отеле
          </h1>
          <p className="text-sm font-semibold text-[#031753]">
            Количество ночей
          </p>
        </div>
      </motion.div>

      <div className="cursor-pointer lg:hidden">
        <div className="w-full aspect-square relative rounded-2xl">
          <Image src={Tour1.src} fill alt={Tour1.src} />
        </div>
        <div className="mt-[10px]">
          <h1 className="text-[20px] font-bold text-[#031753]">
            Проживание в отеле
          </h1>
          <p className="text-sm font-semibold text-[#031753]">
            Количество ночей
          </p>
        </div>
      </div>
    </>
  );
}
