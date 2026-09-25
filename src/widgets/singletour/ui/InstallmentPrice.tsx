'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { useTranslations } from 'next-intl';
import { ComponentType, useState } from 'react';

const PLANS = [
  { months: 3, rate: 0.0725 },
  { months: 6, rate: 0.1375 },
  { months: 9, rate: 0.1975 },
  { months: 12, rate: 0.25 },
] as const;

const DEFAULT_MONTHS = 12;

function formatMoney(value: number) {
  return Math.round(value).toLocaleString('uz-UZ', {
    maximumFractionDigits: 0,
  });
}

function formatRate(rate: number) {
  return `+${(rate * 100).toLocaleString('uz-UZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function monthlyAmount(price: number, months: number, rate: number) {
  return (price * (1 + rate)) / months;
}

export default function InstallmentPrice({
  price,
  passengerCount = 1,
}: {
  price: number;
  passengerCount?: number;
}) {
  const t = useTranslations();
  const [months, setMonths] = useState<number>(DEFAULT_MONTHS);
  const [infoOpen, setInfoOpen] = useState(false);

  if (!Number.isFinite(price) || price <= 0) return null;

  const selected = PLANS.find((plan) => plan.months === months) ?? PLANS[0];
  const selectedMonthly = monthlyAmount(price, selected.months, selected.rate);
  const selectedTotal = price * (1 + selected.rate);
  const perMonth = t('price_per_month_unit');

  const notes: {
    title: string;
    desc: string;
    icon: ComponentType<SvgIconProps>;
    color: string;
  }[] = [
    {
      title: t('pay_safe_title'),
      desc: t('pay_safe_desc'),
      icon: VerifiedUserOutlinedIcon,
      color: '#2563EB',
    },
    {
      title: t('pay_support_title'),
      desc: t('pay_support_desc'),
      icon: HeadsetMicOutlinedIcon,
      color: '#2563EB',
    },
    {
      title: t('pay_fast_title'),
      desc: t('pay_fast_desc'),
      icon: BoltOutlinedIcon,
      color: '#2563EB',
    },
  ];

  return (
    <section className="w-full rounded-[20px] border border-[#EEF2F7] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] lg:px-6 lg:py-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="order-1 min-w-0 lg:order-2 lg:text-right">
            <div className="flex items-center gap-2 text-[#8B919A] lg:justify-end">
            <PaymentsOutlinedIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
            <p className="text-[13px] font-medium leading-4 lg:text-[14px]">
              {t('price_total_label')} ({passengerCount} {t('человек')})
            </p>
            <div className="relative">
              <button
                type="button"
                aria-label={t('installment_open')}
                onClick={() => setInfoOpen((open) => !open)}
                className="grid h-5 w-5 place-items-center text-[#94A3B8]"
              >
                <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              </button>
              {infoOpen ? (
                <div className="absolute left-0 top-7 z-20 w-[220px] rounded-[12px] border border-[#E6EAF2] bg-white p-3 text-left shadow-lg">
                  <p className="text-[14px] font-bold text-[#1B2A4E]">
                    {formatMoney(selectedTotal)} {t('сум')}
                  </p>
                  <p className="mt-1 text-[13px] text-[#9CA3AF] line-through">
                    {formatMoney(price)} {t('сум')}
                  </p>
                  <span className="mt-2 inline-block rounded-[6px] bg-[#E11D48] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {formatRate(selected.rate)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          <p className="mt-1 text-[28px] font-bold leading-9 tracking-tight text-[#1B2A4E] lg:text-[34px] lg:leading-[42px]">
            {formatMoney(price)} uzs
          </p>
        </div>

        <div className="order-2 flex items-center justify-between gap-3 rounded-[16px] bg-[#FFF4EC] px-4 py-3 lg:order-1 lg:min-w-[280px] lg:max-w-[340px]">
          <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 28, color: '#F97316' }} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium leading-4 text-[#F97316] lg:text-[13px]">
              {t('price_start_payment')}
            </p>
            <p className="text-[18px] font-bold leading-6 text-[#F97316] lg:text-[20px]">
              {formatMoney(selectedMonthly)} {perMonth}
            </p>
          </div>
          <ChevronRightIcon sx={{ fontSize: 22, color: '#FDBA74' }} />
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-[#EEF2F7] px-3 py-3 lg:px-4 lg:py-4">
        <div className="flex items-start gap-2">
          <CalendarMonthOutlinedIcon sx={{ fontSize: 20, color: '#64748B' }} />
          <div>
            <p className="text-[15px] font-bold leading-5 text-[#1B2A4E]">
              {t('installment_title')}
            </p>
            <p className="text-[12px] leading-4 text-[#8B919A] lg:text-[13px]">
              {t('installment_pick')}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {PLANS.map((plan) => {
            const active = plan.months === selected.months;
            const monthly = monthlyAmount(price, plan.months, plan.rate);
            return (
              <button
                key={plan.months}
                type="button"
                onClick={() => setMonths(plan.months)}
                className={`rounded-[14px] px-2 py-2.5 text-center transition-colors lg:py-3 ${
                  active
                    ? 'border-2 border-[#3B82F6] bg-[#F3F8FF]'
                    : 'border border-[#E6EAF2] bg-[#FAFBFD]'
                }`}
              >
                <p
                  className={`text-[14px] font-bold leading-5 lg:text-[15px] ${
                    active ? 'text-[#2563EB]' : 'text-[#1B2A4E]'
                  }`}
                >
                  {plan.months} {t('мес')}
                </p>
                <p
                  className={`mt-0.5 text-[13px] font-semibold leading-4 lg:text-[14px] ${
                    active ? 'text-[#2563EB]' : 'text-[#1C1C1E]'
                  }`}
                >
                  {formatMoney(monthly)}
                </p>
                <p className="text-[11px] leading-4 text-[#8B919A] lg:text-[12px]">
                  {perMonth}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 lg:flex lg:items-center lg:justify-between lg:gap-6">
        {notes.map((note) => {
          const Icon = note.icon;
          return (
            <div key={note.title} className="flex min-w-0 items-center gap-2">
              <Icon sx={{ fontSize: 22, color: note.color }} className="shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold leading-4 text-[#1B2A4E] lg:text-[14px]">
                  {note.title}
                </p>
                <p className="hidden truncate text-[12px] leading-4 text-[#8B919A] lg:block">
                  {note.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
