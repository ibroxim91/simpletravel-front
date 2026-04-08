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

export default function TourFoodItem({
  food,
}: {
  food: {
    image: string;
    name: string;
    desc: string;
  };
}) {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        // variants={slideIn}
        className="flex items-center flex-col max-lg:hidden"
      >
        <div className="w-[120px] h-[120px] object-cover cursor-pointer relative rounded-full">
          <Image
            src={food.image}
            width={500}
            height={500}
            quality={100}
            alt={food.image}
            className="w-full h-full rounded-full"
          />
        </div>

        <h1 className="text-[16px] mt-6 font-bold text-[#031753]">
          {food.name}
        </h1>
        <p className="text-[14px] text-[#636363] w-[180px] text-center">
          {food.desc}
        </p>
      </motion.div>
      <div className="flex items-center flex-col lg:hidden">
        <div className="w-[120px] h-[120px] object-cover cursor-pointer relative">
          <Image
            src={food.image}
            fill
            alt={food.image}
            className="w-full h-full rounded-full"
          />
        </div>

        <h1 className="text-[16px] mt-6 font-bold text-[#031753]">
          {food.name}
        </h1>
        <p className="text-[14px] text-[#636363] w-[180px] text-center">
          {food.desc}
        </p>
      </div>
    </>
  );
}
