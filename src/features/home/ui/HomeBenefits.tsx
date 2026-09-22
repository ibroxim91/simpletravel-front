'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

const HomeBenefits = () => {
  const t = useTranslations();

  const benefitItems = [
    {
      title: t('Лучшие цены'),
      desc: t('why_choose_price_desc'),
      bg: 'bg-[#E8F2FF]',
      image: '/images/why-choose-us/best-prices.png',
    },
    {
      title: t('Поддержка 24/7'),
      desc: t('why_choose_support_desc'),
      bg: 'bg-[#FFF6E5]',
      image: '/images/why-choose-us/support.png',
    },
    {
      title: t('Проверенные туры'),
      desc: t('why_choose_verified_desc'),
      bg: 'bg-[#E8F8EE]',
      image: '/images/why-choose-us/verified.png',
    },
    {
      title: t('Быстрое бронирование'),
      desc: t('why_choose_booking_desc'),
      bg: 'bg-[#F3ECFF]',
      image: '/images/why-choose-us/fast-booking.png',
    },
  ];

  return (
    <section className="relative overflow-hidden py-4">
      <div className="custom-container relative">
        <svg
          className="pointer-events-none absolute left-0 top-8 hidden h-16 w-28 text-[#BFD9FF] opacity-70 md:block lg:left-4"
          viewBox="0 0 120 64"
          fill="currentColor"
          aria-hidden
        >
          <ellipse cx="38" cy="40" rx="28" ry="16" />
          <ellipse cx="62" cy="32" rx="26" ry="18" />
          <ellipse cx="88" cy="42" rx="22" ry="14" />
        </svg>

        <div
          className="pointer-events-none absolute right-2 top-10 hidden items-center gap-0 md:flex lg:right-6"
          aria-hidden
        >
          <svg
            className="h-8 w-28 text-[#1A73E8]/45"
            viewBox="0 0 120 32"
            fill="none"
          >
            <path
              d="M2 26 C28 26, 36 6, 58 8 C80 10, 88 24, 118 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="5 6"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="ml-[-6px] h-5 w-5 -rotate-12 text-[#1A73E8]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>

        <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          <h2 className="relative text-[32px] font-bold leading-[40px] text-[#0B3D91] md:text-[44px] md:leading-[52px]">
            {t('Почему выбирают нас')}?
            <span
              className="absolute inset-x-[12%] -bottom-1 mx-auto h-[6px] max-w-[220px] rounded-full bg-[#1A73E8]/25 md:inset-x-[18%]"
              aria-hidden
            />
          </h2>

          <p className="mt-4 max-w-[640px] text-base font-semibold leading-6 text-[#1A73E8] md:text-xl md:leading-7">
            {t('why_choose_title_before')} {t('why_choose_title_highlight')}
          </p>

          <p className="mt-2 max-w-[560px] text-sm font-medium leading-5 text-[#6B7280] md:text-base md:leading-6">
            {t('why_choose_subtitle')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {benefitItems.map((item) => (
            <article
              key={item.title}
              className={`flex flex-col items-center rounded-[24px] px-5 pb-6 pt-5 text-center ${item.bg}`}
            >
              <div className="relative mb-4 h-[120px] w-full max-w-[160px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="160px"
                />
              </div>
              <h3 className="text-lg font-bold leading-6 text-[#0B3D91]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-5 text-[#5B6B86]">
                {item.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBenefits;
