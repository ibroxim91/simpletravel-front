'use client';

import Banner_2 from '@/assets/Mountain.jpg';
import Banner_3 from '@/assets/Mountain_2.jpg';
import Banner_1 from '@/assets/NewYork.jpg';
import Banner_4 from '@/assets/Paris.jpg';
import { Link } from '@/shared/config/i18n/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import EastIcon from '@mui/icons-material/East';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Header = () => {
  const t = useTranslations();
  const slides = [Banner_1, Banner_3, Banner_4, Banner_2];

  return (
    <div className="custom-container mt-5">
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<EastIcon fontSize="small" className="text-[#646465]" />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 2,
          },
        }}
      >
        <Link href="/" className="font-medium text-[#646465]">
          {t('Главная')}
        </Link>
        <p className="text-[#646465] font-medium">{t('О нас')}</p>
      </Breadcrumbs>
      <div className="flex flex-col justify-center items-center">
        <motion.div
          className="mt-20 flex flex-col justify-center items-center gap-5 text-[#031753]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <motion.p
            className="text-4xl text-center max-md:text-2xl font-semibold"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {t('Откройте для себя новые горизонты')}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex flex-col gap-2"
          >
            <motion.p
              className="text-center text-xl leading-relaxed max-md:text-lg text-[#646465] mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t('Ваш идеальный отпуск начинается здесь и сейчас')}
            </motion.p>
            <motion.p
              className="text-center text-xl w-[70%] leading-relaxed max-md:text-lg max-md:w-full text-[#646465] mx-auto"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t('Солнечные рассветы, вечера у моря и приключения')}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
      <div className="mt-10 relative rounded-4xl">
        <div
          className="absolute top-0 left-0 h-full w-[10%] z-10
                bg-gradient-to-r from-[#EDEEF1] to-transparent"
        />

        <Carousel className="w-full mt-4 cursor-pointer">
          <CarouselContent>
            {slides.map((e, idx) => (
              <CarouselItem
                key={idx}
                className="flex flex-col w-auto basis-1/4 max-lg:basis-1/3 max-md:basis-[60%] shrink-0 font-medium"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{
                    duration: 0.6,
                    delay: idx * 0.15,
                    ease: 'easeOut',
                  }}
                  className="w-full h-[400px] aspect-square relative group overflow-hidden rounded-3xl shadow-lg"
                >
                  <Image
                    src={e}
                    alt={String(idx)}
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div
          className="absolute rotate-180 top-0 -right-1 h-full w-[10%] z-10
                bg-gradient-to-r from-[#EDEEF1] to-[rgba(237,238,241,0)]"
        />
      </div>
    </div>
  );
};

export default Header;
