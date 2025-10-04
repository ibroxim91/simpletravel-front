'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import CabinetTabs from './CabinetTabs';
import HotelTabs from './HotelTabs';
import ServiceTab from './ServiceTab';
import SupportTabs from './SupportTabs';
import ToursTabs from './ToursTabs';

const FaqTabs = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('service');

  const variants = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  };

  const variantsTabs = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="custom-container mt-5">
      <p className="text-3xl text-[#001452] font-semibold">
        {t('Ответы на вопросы')}
      </p>
      <motion.div
        key="cabinet"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variantsTabs}
        transition={{ duration: 0.5 }}
      >
        <Tabs
          defaultValue="service"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val)}
          className="!flex !flex-row max-lg:!flex-col !h-full gap-6 mt-5"
        >
          <TabsList className="flex flex-col w-80 max-lg:w-full items-start justify-center !h-full gap-4 p-4 bg-white shadow-md rounded-2xl mb-2">
            <TabsTrigger
              value="service"
              className="w-full justify-start text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#EDEEF1] p-4 rounded-xl data-[state=active]:shadow-sm"
            >
              {t('О сервисе')}
            </TabsTrigger>
            <TabsTrigger
              value="cabinet"
              className="w-full justify-start text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#EDEEF1] p-4 rounded-xl data-[state=active]:shadow-sm"
            >
              {t('Личный кабинет')}
            </TabsTrigger>
            <TabsTrigger
              value="hotel"
              className="w-full justify-start text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#EDEEF1] p-4 rounded-xl data-[state=active]:shadow-sm"
            >
              {t('Отели')}
            </TabsTrigger>
            <TabsTrigger
              value="tours"
              className="w-full justify-start text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#EDEEF1] p-4 rounded-xl data-[state=active]:shadow-sm"
            >
              {t('Туры')}
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="w-full justify-start text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#EDEEF1] p-4 rounded-xl data-[state=active]:shadow-sm"
            >
              {t('Служба поддержки')}
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'service' && (
                <motion.div
                  key="service"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <ServiceTab />
                </motion.div>
              )}

              {activeTab === 'cabinet' && (
                <motion.div
                  key="cabinet"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <CabinetTabs />
                </motion.div>
              )}

              {activeTab === 'hotel' && (
                <motion.div
                  key="hotel"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <HotelTabs />
                </motion.div>
              )}

              {activeTab === 'tours' && (
                <motion.div
                  key="tours"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <ToursTabs />
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <SupportTabs />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default FaqTabs;
