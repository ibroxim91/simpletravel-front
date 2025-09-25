'use client';
import SertificatImg from '@/assets/sertificat.png';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { motion } from 'framer-motion';
import Image from 'next/image';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Sertificat = () => {
  return (
    <div className="custom-container mt-10">
      <div className="flex justify-between max-lg:flex-col gap-10">
        <motion.p
          className="text-4xl w-[50%] text-[#212122] max-lg:w-full font-semibold"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          Надёжность, подтверждённая документами
        </motion.p>

        <motion.p
          className="text-[#646465] font-medium w-[50%] text-xl max-lg:w-full mt-2 max-lg:mt-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          variants={{
            hidden: { opacity: 0, x: 40 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          Каждое наше направление сопровождается официальными лицензиями и
          сертификатами. Это означает, что вы можете быть уверены в безопасности
          и легальности каждого путешествия с нами
        </motion.p>
      </div>
      <Carousel className="w-full mt-20 cursor-pointer">
        <CarouselContent>
          {Array.from({ length: 8 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-1/4 max-lg:basis-1/3 w-full max-md:basis-[70%]"
            >
              <motion.div
                className="bg-white w-full p-4 rounded-xl"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                variants={fadeUpVariants}
              >
                <Image
                  src={SertificatImg}
                  alt={`SertificatImg_${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </motion.div>
              <motion.p
                className="mt-4 text-xl text-[#212122] font-semibold"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
              >
                Соответствие международным стандартам
              </motion.p>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Sertificat;
