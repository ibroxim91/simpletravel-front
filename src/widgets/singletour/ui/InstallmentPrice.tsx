'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/ui/dialog';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const PLANS = [
  { months: 3, rate: 0.0725 },
  { months: 6, rate: 0.1375 },
  { months: 9, rate: 0.1975 },
  { months: 12, rate: 0.25 },
] as const;

const DEFAULT_MONTHS = 12;

function formatMoney(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toLocaleString('uz-UZ', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
    maximumFractionDigits: 1,
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
  align = 'start',
}: {
  price: number;
  align?: 'start' | 'end';
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [months, setMonths] = useState<number>(DEFAULT_MONTHS);

  if (!Number.isFinite(price) || price <= 0) return null;

  const selected = PLANS.find((plan) => plan.months === months) ?? PLANS[3];
  const preview = PLANS[3];
  const previewMonthly = monthlyAmount(price, preview.months, preview.rate);
  const selectedMonthly = monthlyAmount(price, selected.months, selected.rate);
  const selectedTotal = price * (1 + selected.rate);

  return (
    <>
      <div
        className={`flex items-center gap-1.5 ${align === 'end' ? 'justify-end' : 'justify-start'}`}
      >
        <p className="text-[16px] font-bold leading-5 text-[#16A34A] max-lg:text-[15px]">
          {formatMoney(previewMonthly)} {t('installment_per_month')}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('installment_open')}
          className="grid h-6 w-6 place-items-center rounded-full text-[#16A34A]"
        >
          <InfoOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[420px] rounded-[16px] border-0 bg-[#F4F6F8] p-4 sm:max-w-[420px]">
          <DialogTitle className="pr-8 text-[16px] font-semibold text-[#1C1C1E]">
            {t('installment_title')}
          </DialogTitle>

          <div className="rounded-[12px] bg-white px-3 py-4">
            <p className="text-[22px] font-bold leading-7 text-[#16A34A]">
              {formatMoney(selectedMonthly)} {t('сум')}/{t('мес')}
            </p>

            <div className="mt-4 flex gap-2">
              {PLANS.map((plan) => {
                const active = plan.months === selected.months;
                return (
                  <button
                    key={plan.months}
                    type="button"
                    onClick={() => setMonths(plan.months)}
                    className={`h-9 flex-1 rounded-[10px] text-[14px] font-medium transition-colors ${
                      active
                        ? 'border border-[#E5E7EB] bg-white text-[#1C1C1E] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                        : 'bg-transparent text-[#9CA3AF]'
                    }`}
                  >
                    {plan.months} {t('мес')}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[16px] font-bold text-[#1C1C1E]">
                {formatMoney(selectedTotal)} {t('сум')}
              </span>
              <span className="text-[15px] text-[#9CA3AF] line-through">
                {formatMoney(price)}
              </span>
              <span className="rounded-[6px] bg-[#E11D48] px-1.5 py-0.5 text-[12px] font-semibold text-white">
                {formatRate(selected.rate)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
