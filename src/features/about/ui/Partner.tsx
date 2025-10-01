'use client';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { easeOut, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CardData } from '../lib/data';
import SendPartner from './SendPartner';

const Partner = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const MotionDiv = isMobile ? 'div' : motion.div;

  return (
    <div className="custom-container mt-20 mb-10">
      <MotionDiv
        className="flex gap-5 flex-col lg:flex-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <MotionDiv
          className="w-full lg:w-[50%] font-bold text-4xl text-[#212122]"
          variants={fadeUpVariants}
        >
          Качество отдыха, которому можно доверять
        </MotionDiv>
        <MotionDiv
          className="flex flex-col gap-5 w-full lg:w-[50%] text-[#646465] text-md font-medium"
          variants={fadeUpVariants}
        >
          <p>
            В Simple Travel мы верим, что каждое путешествие должно быть лёгким,
            вдохновляющим и незабываемым. Наша миссия — воплотить ваши мечты о
            путешествиях в реальность, создавая индивидуальные маршруты, которые
            сочетают комфорт, приключения и знакомство с культурой.
          </p>
          <p>
            Основанная на страсти к открытиям, Simple Travel превратилась в
            надёжного партнёра для тех, кто ищет больше, чем стандартные туры.
            Мы специализируемся на создании персонализированных путешествий — от
            уединённых отпусков в Альпах до ярких уикендов в лучших городах
            Европы и за её пределами
          </p>
        </MotionDiv>
      </MotionDiv>

      <div className="w-full h-[1px] bg-[#D3D3D3] mt-20" />
      <MotionDiv
        className="flex flex-col gap-10 mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        <MotionDiv className="flex flex-col gap-5" variants={fadeUpVariants}>
          <p className="w-full lg:w-[50%] font-bold text-4xl text-[#212122]">
            Мы организуем лучшие туры, какие только возможны
          </p>
          <p className="w-full lg:w-[70%] text-[#646465] text-md font-medium">
            Мы заботимся о каждой детали вашего путешествия — от выбора маршрута
            и бронирования отелей до экскурсий и комфортного трансфера. Наши
            туры созданы, чтобы превратить отдых в незабываемые впечатления
          </p>
        </MotionDiv>

        <MotionDiv
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {CardData.map((card, idx) => (
            <MotionDiv key={idx} variants={fadeUpVariants}>
              <Card className="bg-[#EDEEF140] rounded-4xl shadow-md border-[#EDEEF1]">
                <CardHeader>
                  <CardTitle>
                    <Button
                      className="w-[50px] h-[50px] rounded-xl"
                      style={{ backgroundColor: card.color }}
                    >
                      <card.icon sx={{ width: '30px', height: '30px' }} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p className="text-xl text-[#031753] font-semibold">
                    {card.title}
                  </p>
                  <p className="text-md text-[#646465] font-medium">
                    {card.text}
                  </p>
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </MotionDiv>
      </MotionDiv>
      <SendPartner />
    </div>
  );
};

export default Partner;
