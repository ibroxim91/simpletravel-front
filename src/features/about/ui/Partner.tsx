'use client';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { easeOut, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CardData } from '../lib/data';
// import SendPartner from './SendPartner';
import { Link } from '@/shared/config/i18n/navigation';

const Partner = () => {
  const [isMobile, setIsMobile] = useState(false);
  const t = useTranslations();

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
          {t('Platforma orqali siz')}
        </MotionDiv>
        <MotionDiv
          className="flex flex-col gap-5 w-full lg:w-[50%] text-[#646465] text-md font-medium"
          variants={fadeUpVariants}
        >
         <p className="text-xl">{t('u1')}</p>
        <p className="text-xl">{t('u2')}</p>
        <p className="text-xl">{t('u3')}</p>
        <p className="text-xl">{t('u4')}</p>
          
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
          <p className="w-full lg:w-[50%] font-bold text-4xl text-[#232325]">
            {t('Nega aynan Simple Travelni tanlash kerak? Chunki bizda:')}
          </p>
          {/* <p className="w-full lg:w-[70%] text-[#636363] text-md font-medium">
            {t('Мы заботимся о каждой детали вашего путешествия')}
          </p> */}
        </MotionDiv>
           
    <MotionDiv
  className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 items-stretch"
  variants={containerVariants}
>
  {CardData.map((card, idx) => (
    <MotionDiv key={idx} variants={fadeUpVariants} className="h-full">
      <Card className="bg-[#EDEEF140] rounded-4xl shadow-md border-[#EDEEF1] h-full flex flex-col">
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
        <CardContent className="flex flex-col gap-2 flex-grow">
          <p className="text-xl text-[#212122] font-semibold">
            {t(card.title)}
          </p>
          <p className="text-md text-[#646465] font-medium">
            {t(card.text)}
          </p>
        </CardContent>
      </Card>
    </MotionDiv>
  ))}
</MotionDiv>



      </MotionDiv>

      <MotionDiv
  className="flex flex-col items-center text-center gap-6 mt-20"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
  variants={fadeUpVariants}
>
  <p className="w-full lg:w-[70%] text-[#232325] text-2xl font-semibold leading-relaxed">
    {t('big_text_1')}
  </p>
  <p className="w-full lg:w-[70%] text-[#646465] text-xl font-medium">
    {t('big_text_2')}
  </p>


  
<Link href="/selectour?page=1">
  <Button className="mt-6 px-8 py-4 bg-[#084FE3] text-white rounded-xl text-lg ">
    {t('start_travel')}
  </Button>
</Link>

</MotionDiv>


      {/* <SendPartner /> */}
    </div>
  );
};

export default Partner;
