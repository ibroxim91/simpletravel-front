'use client';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BoltIcon from '@mui/icons-material/Bolt';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useTranslations } from 'next-intl';

const HomeBenefits = () => {
  const t = useTranslations();
  const benefitItems = [
    {
      icon: <AttachMoneyIcon sx={{ color: '#1A73E8', fontSize: 20 }} />,
      title: t('Лучшие цены'),
      desc: t('Гарантируем самые выгодные предложения на рынке'),
      bg: '#DBEAFE',
    },
    {
      icon: <HeadsetMicIcon sx={{ color: '#FF6B00', fontSize: 24 }} />,
      title: t('Поддержка 24/7'),
      desc: t('Всегда на связи, чтобы помочь вам в любое время'),
      bg: '#FFEDD4',
    },
    {
      icon: <SecurityOutlinedIcon sx={{ color: '#22C55E', fontSize: 20 }} />,
      title: t('Проверенные туры'),
      desc: t('Работаем только с надежными туроператорами'),
      bg: '#DBFCE7',
    },
    {
      icon: <BoltIcon sx={{ color: '#9810FA', fontSize: 22 }} />,
      title: t('Быстрое бронирование'),
      desc: t('Оформите тур всего за несколько минут'),
      bg: '#F3E8FF',
    },
  ];

  return (
    <section>
      <div className="custom-container">
        <div className="mx-auto w-full max-w-[1240px] rounded-[14px] bg-white px-4 py-6 shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:px-6 md:pt-[25px] md:pb-8">
          <div className="flex w-full flex-col gap-3 md:w-[445px] md:gap-4">
            <h3 className="text-[24px] font-bold leading-[32px] text-[#1C1C1E] md:text-[32px] md:leading-[44px]">
              {t('Почему выбирают нас')}
            </h3>
            <p className="text-sm font-medium leading-5 text-[#6B7280] md:text-base md:leading-[22px]">
              {t('Мы делаем путешествия простыми и доступными')}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:mt-[61px] md:grid-cols-4 md:gap-3">
            {benefitItems.map((item) => (
              <div
                key={item.title}
                className="flex h-auto min-h-[150px] w-full flex-col items-center gap-4 md:h-[139px] md:gap-6"
              >
                <div
                  className="grid h-[46px] w-[46px] place-items-center rounded-lg"
                  style={{ backgroundColor: item.bg }}
                >
                  {item.icon}
                </div>
                <div className="flex w-full flex-col items-center gap-2 text-center">
                  <p className="text-[22px] font-bold leading-7 text-[#1C1C1E] md:text-xl md:leading-[27px]">
                    {item.title}
                  </p>
                  <p className="text-sm leading-[17px] text-[#6B7280]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative left-1/2 right-1/2 -mx-[50vw] mt-[104px] h-[581px] w-screen overflow-hidden border-y border-[#8AB3EE] bg-[#E8F1FF] max-lg:left-0 max-lg:right-0 max-lg:mx-0 max-lg:mt-8 max-lg:h-auto max-lg:w-full max-lg:rounded-2xl max-lg:border max-lg:border-[#DDE3EE] max-lg:px-4 max-lg:py-10">
          <div className="flex h-full flex-col items-center gap-[56px] px-0 pb-[102px] pt-[58px] max-lg:gap-8 max-lg:px-0 max-lg:pb-0 max-lg:pt-0">
            <div className="flex w-[445px] flex-col items-center gap-4 max-lg:w-full">
              <h3 className="w-full text-center text-[32px] font-bold leading-[44px] text-[#1C1C1E]">
                {t('Как это работает')}
              </h3>
              <p className="w-full text-center text-base font-medium leading-[22px] text-[#6B7280]">
                {t('Три простых шага до путешествия мечты')}
              </p>
            </div>

            <div className="flex w-full flex-col items-center gap-12 max-lg:gap-8">
              <div className="relative h-20 w-full max-lg:hidden">
                <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-[#BFD0E9] via-[#6CA9EF] to-[#BFD0E9]" />
                <div className="mx-auto flex h-20 w-[924px] items-center justify-between">
                  {['01', '02', '03'].map((num) => (
                    <div
                      key={num}
                      className="relative z-10 grid h-20 w-20 place-items-center rounded-full border-[3px] border-[#1A73E8] bg-white text-[32px] font-semibold leading-[39px] text-[#1A73E8]"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid w-[1240px] grid-cols-3 gap-6 max-lg:w-full max-lg:grid-cols-1">
                {[
                  {
                    icon: <SearchOutlinedIcon sx={{ color: '#FFFFFF', fontSize: 36 }} />,
                    title: t('Выберите направление'),
                    desc: t('Укажите место, даты и количество туристов в форме поиска'),
                    width: 'w-[397px]',
                  },
                  {
                    icon: <CompareArrowsOutlinedIcon sx={{ color: '#FFFFFF', fontSize: 36 }} />,
                    title: t('Сравните предложения'),
                    desc: t('Посмотрите варианты от разных туроператоров и выберите лучший'),
                    width: 'w-[398px]',
                  },
                  {
                    icon: <AccountBalanceWalletOutlinedIcon sx={{ color: '#FFFFFF', fontSize: 34 }} />,
                    title: t('Забронируйте онлайн'),
                    desc: t('Оформите бронирование за пару минут и получите подтверждение'),
                    width: 'w-[397px]',
                  },
                ].map((step) => (
                  <div
                    key={step.title}
                    className={`flex h-[153px] flex-col items-center gap-6 text-center max-lg:h-auto max-lg:w-full ${step.width}`}
                  >
                    <div className="grid h-[60px] w-[60px] place-items-center rounded-[14px] bg-[#1A73E8]">
                      {step.icon}
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      <p className="text-center text-xl font-bold leading-[27px] text-[#1C1C1E]">
                        {step.title}
                      </p>
                      <p className="text-center text-sm leading-[17px] text-[#6B7280]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBenefits;
