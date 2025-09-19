'use client';

import News1 from '@/assets/news_1.jpg';
import News2 from '@/assets/news_2.jpg';
import News3 from '@/assets/news_3.jpg';
import { Link } from '@/shared/config/i18n/navigation';
import { Badge } from '@/shared/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { motion } from 'framer-motion';
import Image from 'next/image';

const data = [
  {
    name: 'Международный конгресс туроператоров: заключительный день в...',
    desc: 'Государственное регулирование туристского рынка и создание условий...',
    date: '18.09.2023',
    img: News1,
  },
  {
    name: 'Международный конгресс туроператоров: заключительный день в...',
    price: 'от 12 450 000 сум',
    desc: 'Государственное регулирование туристского рынка и создание условий...',
    date: '18.09.2023',
    img: News2,
  },
  {
    name: 'Международный конгресс туроператоров: заключительный день в...',
    desc: 'Государственное регулирование туристского рынка и создание условий...',
    date: '18.09.2023',
    img: News3,
  },
];

const News = () => {
  return (
    <div className="custom-container mt-10 font-medium">
      <div className="flex justify-between items-center">
        <Link href={'#'} className="text-3xl text-[#031753] font-semibold">
          Новости
        </Link>
        <Link href={'#'} className="cursor-pointer text-blue-600 max-lg:hidden">
          Больше новостей
        </Link>
      </div>

      <Carousel className="w-full mt-4">
        <CarouselContent>
          {data.map((e, idx) => (
            <CarouselItem
              key={idx}
              className="flex flex-col w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[70%] shrink-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="w-full aspect-square h-[200px] relative group overflow-hidden rounded-3xl shadow-lg"
              >
                <Image
                  src={e.img}
                  alt={e.name}
                  fill
                  className="rounded-3xl object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="flex flex-col absolute bottom-2 left-2 z-20">
                  <Badge
                    variant="default"
                    className="bg-[#031753] px-4 py-1 rounded-4xl text-sm font-semibold"
                  >
                    {e.date}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="mt-2 flex flex-col gap-2 px-4"
              >
                <p className="text-xl font-semibold text-[#031753] w-full">
                  {e.name.length > 50 ? e.name.slice(0, 50) + '...' : e.name}
                </p>
                <p className="text-sm text-[#031753]">{e.desc}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: idx * 0.25 }}
                className="flex px-8"
              >
                <Link
                  href={'#'}
                  className="bg-[#ECF2FF] mt-4 w-full py-3 rounded-4xl text-center text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  Узнать больше
                </Link>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default News;
