'use client';

import { useTranslations } from 'next-intl';
import TabsTourMobile from './TabsTourMobile';
import TabsTours from './TabsTours';

const SearchTours = () => {
  const t = useTranslations();

  return (
    <section className="mx-auto flex w-full max-w-[1240px] min-h-[406px] flex-col gap-10 px-5 pt-0 md:gap-12 xl:gap-16 xl:px-0">
      <div className="mx-auto mt-[44px] w-full max-w-[353px] text-center text-white sm:max-w-[560px] lg:max-w-[760px] xl:mt-0 xl:max-w-[980px]">
        <h1 className="text-[24px] font-bold leading-[100%] sm:text-[28px] md:text-[34px] md:leading-[115%] lg:text-[40px] xl:text-5xl xl:leading-[1.2]">
          <span className="md:hidden">
            {t('Мы находим лучшие цены')}
            <br />
            {t('на туры и билеты — тебе')}
            <br />
            {t('остаётся только выбрать')}
          </span>
          <span className="hidden md:inline">
            {t('Мы находим лучшие цены на туры и билеты — тебе остаётся только выбрать')}
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-[353px] text-[16px] leading-[100%] font-semibold text-[#E8F1FF] sm:max-w-[520px] md:mt-5 md:max-w-[680px] md:text-[18px] md:leading-[120%] xl:max-w-[860px] xl:text-xl xl:leading-[1.35]">
          <span className="md:hidden">
            {t('Найди и забронируй тур вместе с Simple Travel!')}
          </span>
          <span className="hidden md:inline">
            {t(
              'Найди и забронируй идеальный тур по выгодной цене, подбери удобные авиабилеты и начни своё незабываемое приключение вместе с Simple Travel!',
            )}
          </span>
        </p>
      </div>

      <div className=''>
        <TabsTours active="tours" />
      </div>
      <div className="-mt-6 mb-[51px] xl:mb-[104px]">
        <TabsTourMobile active="tours" />
      </div>
    </section>
  );
};

export default SearchTours;
