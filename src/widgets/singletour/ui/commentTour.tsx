import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ToursDetailData } from '../lib/data';
import ReviewsItem from './ReviewsItem';

const CommentTour = ({ data }: { data: ToursDetailData }) => {
  const t = useTranslations();

  return (
    <div className="w-full h-[229px] max-lg:h-full rounded-[24px] bg-gradient-to-r from-[#ABDAFF] to-[#F5EDC7] py-[32px]">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, x: -60 },
          visible: () => ({
            opacity: 1,
            x: 0,
            transition: { delay: 0.5, duration: 0.5 },
          }),
        }}
        className="text-[24px] font-bold text-center mb-6 text-[#232325]"
      >
        {t('Отзывы наших клиентов')}
      </motion.h1>
      {data.ticket_comments?.length > 0 ? (
        <Carousel className="w-full mt-4 cursor-pointer px-4">
          <CarouselContent>
            {data.ticket_comments?.map((item, key) => (
              <CarouselItem
                key={item.user.id}
                className={
                  'flex flex-col w-auto basis-1/3 max-lg:basis-1/2 max-md:basis-[70%] shrink-0 font-medium'
                }
              >
                <motion.div
                  key={key}
                  custom={key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: (i: number) => ({
                      opacity: 1,
                      y: 0,
                      transition: { delay: i * 0.1, duration: 0.5 },
                    }),
                  }}
                >
                  <ReviewsItem key={key} data={item} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: { delay: i * 0.1, duration: 0.5 },
              }),
            }}
            className="text-xl font-medium w-full h-full flex justify-center items-center text-[#232325]"
          >
            {t('Пока нет комментариев')}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CommentTour;
