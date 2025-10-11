'use client';

import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import EastIcon from '@mui/icons-material/East';
import LuggageIcon from '@mui/icons-material/Luggage';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Ticketorder_Api } from '../lib/api';
import formStore from '../lib/hook';
import ParticipantsStep from './ParticipantsStep';
import PaymentStep from './PaymentStep';
import ServicesStep from './ServicesStep';
import TimeStep from './TimeStep';
import TourInfoStep from './TourInfoStep';

export default function Booking() {
  const t = useTranslations();
  const route = useRouter();
  const { id } = useParams();
  const { reset } = formStore();
  const tabSteps: Record<string, number> = {
    time: 1,
    participants: 2,
    package: 3,
    services: 4,
    payment: 5,
  };
  const [activeTab, setActiveTab] = useState('time');
  const [step, setStep] = useState<number>(1);

  const variants = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  };

  const variantsTabs = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };
  const { data } = useQuery({
    queryKey: ['tickets_info', id],
    queryFn: () => Ticketorder_Api.ticketorder_info({ id: Number(id) }),
    select(data) {
      return data.data;
    },
  });

  return (
    <div className="custom-container py-[16px]">
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
        <Link href={'/selectour'} className="text-[#646465] font-medium">
          {t('Подобрать тур')}
        </Link>
        <p className="text-[#646465] font-medium">{t('Забронировать')}</p>
      </Breadcrumbs>

      <div className="flex items-center gap-[16px] mt-[20px]">
        <div
          className="w-[40px] h-[40px] cursor-pointer border-2 border-[#DFDFDF] bg-white rounded-full flex items-center justify-center"
          onClick={() => {
            route.back();
            reset();
          }}
        >
          <ChevronLeftIcon sx={{ color: '#031753' }} />
        </div>
        <h1 className="text-[#031753] text-[32px] font-semibold">
          {t('Забронировать')}
        </h1>
      </div>

      <div className="custom-container mt-10">
        <motion.div
          key="cabinet"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variantsTabs}
          transition={{ duration: 0.5 }}
        >
          <Tabs
            defaultValue="time"
            value={activeTab}
            className="!flex !flex-row max-lg:!flex-col !h-full gap-6 mt-5"
          >
            <TabsList className="flex flex-col w-80 max-lg:w-full items-start justify-center !h-full gap-4 p-4 bg-white shadow-md rounded-2xl mb-2">
              <TabsTrigger
                value="time"
                className={clsx(
                  'w-full relative justify-between text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#084FE3] data-[state=active]:text-[#FFFF] p-4 rounded-xl data-[state=active]:shadow-sm',
                  step !== 1 ? 'bg-[#EDEEF180] text-[#084FE3]' : 'bg-white',
                )}
              >
                <div className="flex gap-4">
                  <CalendarMonthIcon sx={{ width: '28px', height: '28px' }} />
                  <p className={clsx('text-lg', step !== 1 && 'text-black')}>
                    {t('Дата')}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center absolute right-5 bottom-0">
                  <div
                    className={clsx(
                      'border w-6 h-6 rounded-full flex justify-center items-center',
                      step !== 1 ? 'border-[#084FE3]' : 'border-white',
                    )}
                  >
                    <div
                      className={clsx(
                        'w-3 h-3 rounded-full',
                        step !== 1 ? 'bg-[#084FE3]' : 'bg-white',
                      )}
                    />
                  </div>
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={step !== 1 ? '#084FE3' : '#FFFF'}
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="participants"
                className={clsx(
                  'w-full relative justify-between text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#084FE3] data-[state=active]:text-[#FFFF] p-4 rounded-xl data-[state=active]:shadow-sm',
                  step < 2
                    ? 'bg-white text-[#084FE3]'
                    : 'bg-[#EDEEF180] text-[#084FE3]',
                )}
              >
                <div className="flex gap-4">
                  <PersonIcon sx={{ width: '28px', height: '28px' }} />
                  <p
                    className={clsx(
                      'text-lg',
                      step < 2
                        ? 'text-[#000]'
                        : step === 2
                          ? 'text-[#FFFF]'
                          : 'text-[#000]',
                    )}
                  >
                    {t('Участники')}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center absolute right-5 bottom-0">
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={
                        step < 2 ? '#909091' : step === 2 ? '#FFFF' : '#084FE3'
                      }
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                  <div
                    className={clsx(
                      'border w-6 h-6 rounded-full flex justify-center items-center',
                      step < 2
                        ? 'border-gray-400'
                        : step === 2
                          ? 'border-white'
                          : 'border-[#084FE3]',
                    )}
                  >
                    {step >= 2 && (
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          step < 2
                            ? 'bg-gray-400'
                            : step === 2
                              ? 'bg-white'
                              : 'bg-[#084FE3]',
                        )}
                      />
                    )}
                  </div>
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={
                        step < 2 ? '#909091' : step === 2 ? '#FFFF' : '#084FE3'
                      }
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="package"
                className={clsx(
                  'w-full relative justify-between text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#084FE3] data-[state=active]:text-[#FFFF] p-4 rounded-xl data-[state=active]:shadow-sm',
                  step < 3
                    ? 'bg-white text-[#084FE3]'
                    : 'bg-[#EDEEF180] text-[#084FE3]',
                )}
              >
                <div className="flex gap-4">
                  <LuggageIcon sx={{ width: '28px', height: '28px' }} />
                  <p
                    className={clsx(
                      'text-lg',
                      step < 3
                        ? 'text-[#000]'
                        : step === 3
                          ? 'text-[#FFFF]'
                          : 'text-[#000]',
                    )}
                  >
                    {t('Отели')}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center absolute right-5 bottom-0">
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={
                        step < 3 ? '#909091' : step === 3 ? '#FFFF' : '#084FE3'
                      }
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                  <div
                    className={clsx(
                      'border w-6 h-6 rounded-full flex justify-center items-center',
                      step < 3
                        ? 'border-gray-400'
                        : step === 3
                          ? 'border-white'
                          : 'border-[#084FE3]',
                    )}
                  >
                    {step >= 3 && (
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          step < 3
                            ? 'bg-gray-400'
                            : step === 3
                              ? 'bg-white'
                              : 'bg-[#084FE3]',
                        )}
                      />
                    )}
                  </div>
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={
                        step < 3 ? '#909091' : step === 3 ? '#FFFF' : '#084FE3'
                      }
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="services"
                className={clsx(
                  'w-full relative justify-between text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#084FE3] data-[state=active]:text-[#FFFF] p-4 rounded-xl data-[state=active]:shadow-sm',
                  step < 4
                    ? 'bg-white text-[#084FE3]'
                    : 'bg-[#EDEEF180] text-[#084FE3]',
                )}
              >
                <div className="flex gap-4">
                  <SettingsIcon sx={{ width: '28px', height: '28px' }} />
                  <p
                    className={clsx(
                      'text-lg',
                      step < 4
                        ? 'text-[#000]'
                        : step === 4
                          ? 'text-[#FFFF]'
                          : 'text-[#000]',
                    )}
                  >
                    {t('Услуги')}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center absolute right-5 bottom-0">
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={
                        step < 4 ? '#909091' : step === 4 ? '#FFFF' : '#084FE3'
                      }
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                  <div
                    className={clsx(
                      'border w-6 h-6 rounded-full flex justify-center items-center',
                      step < 4
                        ? 'border-gray-400'
                        : step === 4
                          ? 'border-white'
                          : 'border-[#084FE3]',
                    )}
                  >
                    {step >= 4 && (
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          step < 4
                            ? 'bg-gray-400'
                            : step === 4
                              ? 'bg-white'
                              : 'bg-[#084FE3]',
                        )}
                      />
                    )}
                  </div>
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={
                        step < 4 ? '#909091' : step === 4 ? '#FFFF' : '#084FE3'
                      }
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="payment"
                className={clsx(
                  'w-full relative justify-between text-center cursor-pointer text-md font-semibold data-[state=active]:bg-[#084FE3] data-[state=active]:text-[#FFFF] p-4 rounded-xl data-[state=active]:shadow-sm',
                  step < 5
                    ? 'bg-white text-[#084FE3]'
                    : 'bg-[#EDEEF180] text-[#084FE3]',
                )}
              >
                <div className="flex gap-4">
                  <PaymentsIcon sx={{ width: '28px', height: '28px' }} />
                  <p
                    className={clsx(
                      'text-lg',
                      step < 5
                        ? 'text-[#000]'
                        : step === 5
                          ? 'text-[#FFFF]'
                          : 'text-[#000]',
                    )}
                  >
                    {t('Оплата')}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center absolute right-5 top-0">
                  <svg
                    width="2"
                    height="30"
                    viewBox="0 0 2 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0V30"
                      stroke={
                        step < 5 ? '#909091' : step === 5 ? '#FFFF' : '#084FE3'
                      }
                      strokeWidth="3"
                      strokeDasharray="10 10"
                    />
                  </svg>
                  <div
                    className={clsx(
                      'border w-6 h-6 rounded-full flex justify-center items-center',
                      step < 5
                        ? 'border-gray-400'
                        : step === 5
                          ? 'border-white'
                          : 'border-[#084FE3]',
                    )}
                  >
                    {step >= 5 && (
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          step < 5
                            ? 'bg-gray-400'
                            : step === 5
                              ? 'bg-white'
                              : 'bg-[#084FE3]',
                        )}
                      />
                    )}
                  </div>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {activeTab === 'time' && (
                  <motion.div
                    key="time"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                  >
                    <TimeStep
                      data={data}
                      onNext={() => {
                        setActiveTab('participants');
                        setStep(tabSteps['participants']);
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'participants' && (
                  <motion.div
                    key="participants"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                  >
                    <ParticipantsStep
                      onNext={() => {
                        setActiveTab('package');
                        setStep(tabSteps['package']);
                      }}
                      onPrev={() => {
                        setActiveTab('time');
                        setStep(tabSteps['time']);
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'package' && (
                  <motion.div
                    key="hotel"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                  >
                    <TourInfoStep
                      data={data}
                      onNext={() => {
                        setActiveTab('services');
                        setStep(tabSteps['services']);
                      }}
                      onPrev={() => {
                        setActiveTab('participants');
                        setStep(tabSteps['participants']);
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div
                    key="tours"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                  >
                    <ServicesStep
                      data={data}
                      onNext={() => {
                        setActiveTab('payment');
                        setStep(tabSteps['payment']);
                      }}
                      onPrev={() => {
                        setActiveTab('package');
                        setStep(tabSteps['package']);
                      }}
                    />
                  </motion.div>
                )}

                {activeTab === 'payment' && (
                  <motion.div
                    key="support"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.5 }}
                  >
                    <PaymentStep
                      data={data}
                      onPrev={() => {
                        setActiveTab('services');
                        setStep(tabSteps['services']);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
