'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type Step = {
  num: string;
  numBg: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
};

const HowItWorks = () => {
  const t = useTranslations();

  const steps: Step[] = [
    {
      num: '1',
      numBg: 'bg-[#1A73E8]',
      title: t('how_it_works_step1_title'),
      desc: t('how_it_works_step1_desc'),
      image: '/images/how-it-works/search.png',
      imageAlt: t('how_it_works_step1_title'),
    },
    {
      num: '2',
      numBg: 'bg-[#22C55E]',
      title: t('how_it_works_step2_title'),
      desc: t('how_it_works_step2_desc'),
      image: '/images/how-it-works/booking.png',
      imageAlt: t('how_it_works_step2_title'),
    },
    {
      num: '3',
      numBg: 'bg-[#F97316]',
      title: t('how_it_works_step3_title'),
      desc: t('how_it_works_step3_desc'),
      image: '/images/how-it-works/confirm.png',
      imageAlt: t('how_it_works_step3_title'),
    },
    {
      num: '4',
      numBg: 'bg-[#1E3A8A]',
      title: t('how_it_works_step4_title'),
      desc: t('how_it_works_step4_desc'),
      image: '/images/how-it-works/ticket.jpg',
      imageAlt: t('how_it_works_step4_title'),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#F3F8FF] py-16 max-lg:py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgba(26,115,232,0.12), transparent 40%), radial-gradient(circle at 88% 15%, rgba(26,115,232,0.1), transparent 35%)',
        }}
      />
      <div className="custom-container relative z-10 mx-auto w-full max-w-[1240px]">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-3 text-center max-lg:items-start max-lg:text-left">
          <h2 className="text-[40px] font-bold leading-[48px] text-[#1C1C1E] max-lg:text-[28px] max-lg:leading-9">
            {t('how_it_works_badge')}
          </h2>
          <p className="text-xl font-semibold leading-7 text-[#1C1C1E] max-lg:text-lg max-lg:leading-6">
            {t('how_it_works_title')}
          </p>
          <p className="text-base font-medium leading-[22px] text-[#6B7280] max-lg:text-sm">
            {t('how_it_works_subtitle')}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 max-lg:mt-8 lg:flex-row lg:items-stretch lg:justify-center lg:gap-3">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3"
            >
              <article className="relative flex w-full flex-col rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(26,115,232,0.08)] lg:w-[260px] xl:w-[280px]">
                <span
                  className={`absolute left-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full text-lg font-bold leading-none text-white ${step.numBg}`}
                >
                  {step.num}
                </span>
                <div className="relative mx-auto mt-6 mb-5 h-[140px] w-full max-w-[180px]">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    className="object-contain"
                    sizes="180px"
                  />
                </div>
                <h3 className="text-center text-lg font-bold leading-6 text-[#1C1C1E] max-lg:text-left">
                  {step.title}
                </h3>
                <p className="mt-2 text-center text-sm leading-5 text-[#6B7280] max-lg:text-left">
                  {step.desc}
                </p>
              </article>

              {index < steps.length - 1 ? (
                <div className="hidden shrink-0 text-[#1A73E8] lg:block" aria-hidden>
                  <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
