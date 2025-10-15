'use client';

import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Faq_Api } from '../lib/api';
import ServiceTab from './ServiceTab';
import SupportTabs from './SupportTabs';

const FaqTabs = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('');

  const variants = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  };

  const variantsTabs = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const { data, isLoading } = useQuery({
    queryKey: ['faq'],
    queryFn: () => Faq_Api.getFaq(),
    select(data) {
      return data.data;
    },
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setActiveTab(data[0].name);
    }
  }, [data]);

  // Skeleton komponenti
  const Skeleton = () => (
    <div className="flex gap-6 mt-5">
      <div className="flex flex-col w-80 max-lg:w-full gap-4 p-4 bg-white shadow-md rounded-2xl">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-12 bg-gray-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
      <div className="flex-1 space-y-4 p-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-6 bg-gray-200 rounded-md animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="custom-container mt-5">
      <p className="text-3xl text-[#031753] font-semibold">
        {t('Ответы на вопросы')}
      </p>

      {isLoading ? (
        <Skeleton />
      ) : (
        <motion.div
          key="cabinet"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variantsTabs}
          transition={{ duration: 0.5 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val)}
            className="!flex !flex-row max-lg:!flex-col !h-full gap-6 mt-5"
          >
            <TabsList className="flex flex-col w-80 max-lg:w-full items-start justify-center !h-full gap-4 p-4 bg-white shadow-md rounded-2xl mb-2">
              {data?.map((e) => (
                <TabsTrigger
                  key={e.name}
                  value={e.name}
                  className="w-full text-[#212122] justify-start text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#EDEEF1] p-4 rounded-xl data-[state=active]:shadow-sm"
                >
                  {e.name}
                </TabsTrigger>
              ))}
              <TabsTrigger
                value="support"
                className="w-full text-[#212122] justify-start text-center text-md font-semibold data-[state=active]:bg-[#EDEEF1] p-4 rounded-xl data-[state=active]:shadow-sm"
              >
                {t('Служба поддержки')}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {data?.map((e) => (
                  <React.Fragment key={`${e.id}`}>
                    {activeTab === e.name && (
                      <motion.div
                        key={e.name}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                        transition={{ duration: 0.5 }}
                      >
                        <ServiceTab faqs={e} />
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}

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
      )}
    </div>
  );
};

export default FaqTabs;
