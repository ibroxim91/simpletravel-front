import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import Rating from '@mui/material/Rating';
import { motion } from 'framer-motion';
import { Plus, Send, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ToursDetailData } from '../lib/data';
import ReviewsItem from './ReviewsItem';

const CommentTour = ({ data }: { data: ToursDetailData }) => {
  const t = useTranslations();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="w-full h-full relative max-lg:h-full rounded-[24px] bg-gradient-to-r from-[#ABDAFF] to-[#F5EDC7] py-[32px]">
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
      <motion.button
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
        onClick={() => setShowForm(!showForm)}
        className="bg-white/40 backdrop-blur-sm flex rounded-2xl items-center cursor-pointer text-[#232325] py-2 px-4 m-auto mb-10 gap-2 shadow-xl border border-white/50"
      >
        {showForm ? (
          <>
            <XIcon className="size-5 text-[#232325]" />
            {t('Bekor qilish')}
          </>
        ) : (
          <>
            <Plus className="size-5 text-[#232325] " />
            {t('Izoh qoldirish')}
          </>
        )}
      </motion.button>
      {showForm ? (
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
          className="px-4 max-w-full mx-auto"
        >
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <h3 className="text-3xl font-bold text-[#232325] mb-8 text-center bg-gradient-to-r from-[#084FE3] to-[#0A6EFF] bg-clip-text">
              {t('Sizning fikringiz')}
            </h3>

            <div className="space-y-8">
              <div className="bg-white/60 rounded-xl p-6 shadow-sm">
                <label className="text-[#232325] font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#084FE3] to-[#0A6EFF] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    1
                  </span>
                  {t('Reytingni tanlang')}
                </label>
                <div className="flex gap-2 items-center justify-center py-4">
                  <Rating
                    name="tour-rating"
                    onChange={(__, newValue) => {
                      setRating(newValue || 0);
                    }}
                    value={rating}
                    size="large"
                    sx={{
                      color: '#F08125',
                      '& .MuiRating-iconEmpty': {
                        color: '#E0E0E0',
                      },
                    }}
                  />
                </div>
              </div>

              <div className="bg-white/60 rounded-xl p-6 shadow-sm">
                <label className="text-[#232325] font-bold mb-4 text-lg flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#084FE3] to-[#0A6EFF] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    2
                  </span>
                  {t('Izohingizni yozing')}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("Sayohat haqida fikringizni baham ko'ring")}
                  className="w-full h-40 p-5 border-2 border-[#E0E0E0] text-[#232325] rounded-xl focus:border-[#084FE3] focus:outline-none resize-none transition-all duration-300 bg-white/80 placeholder:text-gray-400"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!rating || !comment.trim()}
                className="w-full bg-gradient-to-r cursor-pointer from-[#084FE3] to-[#0A6EFF] text-white py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <Send size={24} />
                {t('Yuborish')}
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default CommentTour;
