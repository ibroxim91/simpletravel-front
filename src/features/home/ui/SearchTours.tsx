'use client';

import { useTranslations } from 'next-intl';
import TabsTourMobile from './TabsTourMobile';
import TabsTours from './TabsTours';

const SearchTours = () => {
  const t = useTranslations();

  return (
    <section className="mx-auto flex w-full max-w-[1240px] min-h-[406px] flex-col gap-16 px-4 xl:px-0">
      <div className="mx-auto max-w-[980px] text-center text-white">
        <h1 className="text-4xl font-bold leading-[1.2] md:text-5xl">
          {t('Мы находим лучшие цены на туры и билеты — тебе остаётся только выбрать')}
        </h1>
        <p className="mx-auto mt-5 max-w-[860px] text-xl leading-[1.35] text-[#EAF2FF]">
          {t(
            'Найди и забронируй идеальный тур по выгодной цене, подбери удобные авиабилеты и начни своё незабываемое приключение вместе с Simple Travel!',
          )}
        </p>
      </div>

      <div>
        <TabsTours active="tours" />
      </div>
      <div className="-mt-6">
        <TabsTourMobile active="tours" />
      </div>
    </section>
  );
};

export default SearchTours;
