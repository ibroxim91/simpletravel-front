'use client';

import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { ComponentType } from 'react';
import tourDates from '../../../../public/images/tour-brief/dates.png';
import tourDuration from '../../../../public/images/tour-brief/durations.png';
import tourHotel from '../../../../public/images/tour-brief/hotel.png';
import tourMeal from '../../../../public/images/tour-brief/meal.png';
import tourParticipants from '../../../../public/images/tour-brief/participants.png';

type IconType = ComponentType<SvgIconProps>;

type Props = {
  hotelRating?: number | string | null;
  mealPlan?: string | null;
  durationDays?: number | null;
  passengerCount?: number | null;
  departureDate?: string;
  returnDate?: string;
};

function formatShortDate(value?: string) {
  if (!value) return '--.--.--';

  let date: Date | null = null;
  if (/^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    date = new Date(`${year}-${month}-${day}`);
  } else {
    date = new Date(value);
  }

  if (!date || Number.isNaN(date.getTime())) return '--.--.--';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

export default function TourBrief({
  hotelRating,
  mealPlan,
  durationDays,
  passengerCount,
  departureDate,
  returnDate,
}: Props) {
  const t = useTranslations();
  const days = Number(durationDays) || 0;
  const nights = days > 0 ? days - 1 : 0;
  const people = Number(passengerCount) || 0;
  const ratingNumber = Number(hotelRating);
  const starsLabel =
    Number.isFinite(ratingNumber) && ratingNumber > 0
      ? `${Math.round(ratingNumber)} ${t('звездочный')}`
      : hotelRating
        ? String(hotelRating)
        : '—';

  const mealCode = (mealPlan || '').toUpperCase();
  const mealNames: Record<string, string> = {
    FB: t('FB'),
    BB: t('BB'),
    HB: t('HB'),
    AI: t('AI'),
    UAI: t('UAI'),
    RO: t('RO'),
  };
  const mealLabel = mealNames[mealCode] || t('Все включено');
  const mealBadge = mealCode && mealCode !== 'RO' ? mealCode : '';

  const cards: {
    id: string;
    label: string;
    value: string;
    hint?: string;
    badge?: string;
    image: StaticImageData;
    surface: string;
    circle: string;
  }[] = [
    {
      id: 'hotel-type',
      label: t('Тип отеля'),
      value: starsLabel,
      image: tourHotel,
      surface: 'lg:bg-[#EEF4FF]',
      circle: 'bg-[#DCE9FF]',
    },
    {
      id: 'meal',
      label: t('Питание'),
      value: mealLabel,
      badge: mealBadge,
      image: tourMeal,
      surface: 'lg:bg-[#FFF4EA]',
      circle: 'bg-[#FFE6CC]',
    },
    {
      id: 'duration',
      label: t('Длительность'),
      value: `${days || '—'} ${t('дней')}`,
      hint: `${nights} ${t('ночей')}`,
      image: tourDuration,
      surface: 'lg:bg-[#E8F8F0]',
      circle: 'bg-[#D4F3E4]',
    },
    {
      id: 'group',
      label: t('Количество'),
      value: `${people || '—'} ${t('человек')}`,
      hint: people ? `${people} ${t('tour_adults')}` : undefined,
      image: tourParticipants,
      surface: 'lg:bg-[#F4EEFF]',
      circle: 'bg-[#E6DCFF]',
    },
    {
      id: 'dates',
      label: t('Дата тура'),
      value: `${formatShortDate(departureDate)} – ${formatShortDate(returnDate)}`,
      hint: days
        ? `${days} ${t('дней')} / ${nights} ${t('ночей')}`
        : undefined,
      image: tourDates,
      surface: 'lg:bg-[#FDECEF]',
      circle: 'bg-[#F8D7E0]',
    },
  ];

  const perks: {
    id: string;
    title: string;
    desc: string;
    icon: IconType;
    color: string;
  }[] = [
    {
      id: 'flight',
      title: t('tour_flight_title'),
      desc: t('tour_flight_desc'),
      icon: FlightTakeoffIcon,
      color: '#1A73E8',
    },
    {
      id: 'transfer',
      title: t('Трансфер'),
      desc: t('tour_transfer_desc'),
      icon: DirectionsBusFilledOutlinedIcon,
      color: '#1A73E8',
    },
    {
      id: 'insurance',
      title: t('Страхование'),
      desc: t('tour_insurance_desc'),
      icon: VerifiedUserOutlinedIcon,
      color: '#16A34A',
    },
    {
      id: 'support',
      title: t('tour_support_title'),
      desc: t('tour_support_desc'),
      icon: HeadsetMicOutlinedIcon,
      color: '#1A73E8',
    },
  ];

  return (
    <section className="mb-8 mt-10 flex w-full flex-col gap-5 max-lg:mt-6">
      <div>
        <h2 className="text-[28px] font-bold leading-8 text-[#1B2A4E] max-lg:text-[22px]">
          {t('О туре кратко')}
        </h2>
        <div className="mt-2 h-1 w-10 rounded-full bg-[#1A73E8]" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5 lg:gap-4">
        {cards.map((card) => {
          return (
            <article key={card.id}>
              <div className="flex items-center gap-3 rounded-[18px] border border-[#EEF2F6] bg-white px-3 py-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:hidden">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${card.circle}`}
                >
                  <Image
                    src={card.image}
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold leading-5 text-[#1B2A4E]">
                    {card.label}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-semibold leading-5 text-[#1C1C1E]">
                      {card.value}
                    </p>
                    {card.badge ? (
                      <span className="rounded-md bg-[#1A73E8] px-1.5 py-0.5 text-[11px] font-bold leading-4 text-white">
                        {card.badge}
                      </span>
                    ) : null}
                  </div>
                  {card.hint ? (
                    <p className="mt-0.5 text-[13px] leading-4 text-[#8B919A]">
                      {card.hint}
                    </p>
                  ) : null}
                </div>
                <KeyboardArrowRightIcon sx={{ color: '#C5CAD3', fontSize: 22 }} />
              </div>

              <div
                className={`hidden min-h-[248px] flex-col items-center rounded-[22px] px-3 py-5 text-center lg:flex ${card.surface}`}
              >
                <p className="text-[15px] font-bold leading-5 text-[#1B2A4E]">
                  {card.label}
                </p>
                <div className="my-2 flex h-[124px] w-full items-center justify-center">
                  <Image
                    src={card.image}
                    alt=""
                    width={180}
                    height={124}
                    className="h-[124px] w-auto max-w-full object-contain drop-shadow-[0_8px_12px_rgba(27,42,78,0.12)]"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <p className="text-[16px] font-bold leading-5 text-[#1B2A4E]">
                    {card.value}
                  </p>
                  {card.badge ? (
                    <span className="rounded-md bg-[#1A73E8] px-1.5 py-0.5 text-[11px] font-bold leading-4 text-white">
                      {card.badge}
                    </span>
                  ) : null}
                </div>
                {card.hint ? (
                  <p className="mt-1 text-[13px] leading-4 text-[#8B919A]">
                    {card.hint}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-[20px] bg-[#F3F7FF] px-4 py-4 lg:grid-cols-4 lg:gap-4 lg:px-6 lg:py-5">
        {perks.map((perk) => {
          const Icon = perk.icon;
          return (
            <div key={perk.id} className="flex items-center gap-3">
              <Icon sx={{ color: perk.color, fontSize: 28 }} />
              <div className="min-w-0">
                <p className="text-[14px] font-bold leading-5 text-[#1B2A4E]">
                  {perk.title}
                </p>
                <p className="text-[12px] leading-4 text-[#8B919A]">{perk.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
