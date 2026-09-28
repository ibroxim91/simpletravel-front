'use client';

import httpClient from '@/shared/config/api/httpClient';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { CREATE_LEAD } from '@/shared/config/api/URLs';
import Ticket_Api from '@/widgets/selectour/lib/api';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Calendar, Check, ChevronDown, ChevronRight, MapPin, Phone, Search, Send, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FormEvent, useMemo, useState, type ReactNode } from 'react';

const OPERATOR_CODES = new Set([
  '90',
  '91',
  '92',
  '93',
  '94',
  '50',
  '55',
  '77',
  '78',
  '99',
  '95',
  '70',
  '87',
  '88',
  '97',
  '33',
  '20',
  '98',
]);

const MONTH_KEYS = [
  'lead_month_1',
  'lead_month_2',
  'lead_month_3',
  'lead_month_4',
  'lead_month_5',
  'lead_month_6',
  'lead_month_7',
  'lead_month_8',
  'lead_month_9',
  'lead_month_10',
  'lead_month_11',
  'lead_month_12',
] as const;

const TRAVELERS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '5_plus', label: '5+' },
];

function localDigits(raw: string) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length > 9) {
    digits = digits.slice(3);
  }
  return digits.slice(0, 9);
}

function formatLocal(digits: string) {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    .filter(Boolean)
    .join(' ');
}

function isValidPhone(digits: string) {
  return digits.length === 9 && OPERATOR_CODES.has(digits.slice(0, 2));
}

function monthValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function LeadForm() {
  const t = useTranslations();
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [phone, setPhone] = useState('');
  const [month, setMonth] = useState('');
  const [travelers, setTravelers] = useState('1');

  const months = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    return Array.from({ length: 18 }, (_, index) => {
      const date = new Date(start.getFullYear(), start.getMonth() + index, 1);
      return {
        value: monthValue(date),
        label: `${t(MONTH_KEYS[date.getMonth()])} ${date.getFullYear()}`,
      };
    });
  }, [t]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const digits = localDigits(phone);
    if (!isValidPhone(digits)) {
      setError(t('lead_phone_invalid'));
      return;
    }
    if (!month || month < months[0]?.value) {
      setError(t('lead_month_invalid'));
      return;
    }
    setPending(true);
    try {
      await httpClient.post(CREATE_LEAD, {
        name: form.get('name'),
        phone: `998${digits}`,
        travel_month: month,
        travelers_count: travelers,
        destination: form.get('destination'),
      });
      setDone(true);
    } catch {
      setError(t('lead_error'));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return <LeadSuccess />;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto my-8 w-full max-w-md rounded-3xl bg-white px-5 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:px-7"
    >
      <h1 className="text-[28px] font-bold leading-tight text-blue-600">{t('lead_title')}</h1>
      <p className="mt-2 text-sm leading-5 text-slate-500">{t('lead_subtitle')}</p>

      <Field label={t('lead_name')} icon={<User className="h-4 w-4" />}>
        <input
          name="name"
          required
          placeholder={t('lead_name_placeholder')}
          className={inputClass}
        />
      </Field>

      <Field label={t('lead_phone')} icon={<Phone className="h-4 w-4" />}>
        <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500">
          <div className="flex shrink-0 items-center gap-2 border-r border-slate-200 px-3 text-sm font-medium text-slate-800">
            <UzFlag />
            +998
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <input
            inputMode="numeric"
            autoComplete="tel"
            required
            value={formatLocal(phone)}
            placeholder={t('lead_phone_placeholder')}
            onChange={(event) => setPhone(localDigits(event.target.value))}
            className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </Field>

      <Field label={t('lead_month')} icon={<Calendar className="h-4 w-4" />}>
        <div className="relative">
          <select
            required
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className={`${inputClass} appearance-none pr-10 ${month ? 'text-slate-900' : 'text-slate-400'}`}
          >
            <option value="" disabled>
              {t('lead_month_placeholder')}
            </option>
            {months.map((item) => (
              <option key={item.value} value={item.value} className="text-slate-900">
                {item.label}
              </option>
            ))}
          </select>
          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </Field>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Users className="h-4 w-4 text-slate-500" />
          {t('lead_travelers')}
        </div>
        <div className="grid grid-cols-6 gap-2">
          {TRAVELERS.map((item) => {
            const active = travelers === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTravelers(item.value)}
                className={`rounded-xl border py-2.5 text-sm font-semibold ${
                  active
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-white text-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <Field label={t('lead_destination')} icon={<MapPin className="h-4 w-4" />}>
        <input
          name="destination"
          required
          placeholder={t('lead_destination_placeholder')}
          className={inputClass}
        />
      </Field>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-base font-semibold text-white disabled:opacity-60"
      >
        {pending ? t('lead_sending') : t('lead_submit')}
        {!pending && <ArrowRight className="h-4 w-4" />}
      </button>
      <p className="mt-3 text-center text-xs text-slate-400">{t('lead_secure')}</p>
    </form>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500';

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="text-slate-500">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function hotPersonPrice(price: unknown) {
  const num = parseFloat(String(price ?? '')) / 2;
  if (!Number.isFinite(num)) return '';
  return String(Math.round(num * 10) / 10);
}

function tourPhoto(item: { hotel_photo?: string; hotel_photos?: { image?: string }[]; ticket_images?: string }) {
  return String(item?.hotel_photo || item?.hotel_photos?.[0]?.image || item?.ticket_images || '').trim();
}

function LeadSuccess() {
  const t = useTranslations();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['home_offers_hot', 'hot', 'lead-success'],
    queryFn: async () => {
      try {
        return await Ticket_Api.GetHomeOffers({ hot: true, page: 1 });
      } catch {
        return await Ticket_Api.GetHomeTickets();
      }
    },
    select: (res) => (res?.data?.results?.tickets ?? []).slice(0, 6),
  });

  const openHotTours = () => router.push('/selectour?hot=true');

  return (
    <div className="mx-auto my-8 w-full max-w-md rounded-3xl bg-white px-4 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:px-5">
      <div className="relative overflow-hidden rounded-2xl bg-emerald-50 px-4 py-3">
        <div className="flex items-start gap-3 pr-10">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
            <Check className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-slate-900">{t('lead_success_title')}</p>
            <p className="mt-0.5 text-sm text-slate-500">{t('lead_success_text')}</p>
          </div>
        </div>
        <Send className="absolute right-3 top-3 h-7 w-7 -rotate-12 text-sky-400" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">{t('lead_suggest_title')}</h2>
          <p className="mt-1 text-xs text-slate-500">{t('lead_suggest_subtitle')}</p>
        </div>
        <button type="button" onClick={openHotTours} className="shrink-0 text-sm font-medium text-blue-600">
          {t('lead_see_all')}
          <ChevronRight className="ml-0.5 inline h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="h-24 animate-pulse bg-slate-100" />
              <div className="space-y-2 p-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        {!isLoading &&
          (data ?? []).map((item) => {
            const photo = tourPhoto(item);
            const place = item.destination?.name || item.title;
            const price = hotPersonPrice(item.price);
            return (
              <Link
                key={item.id}
                href={`/selectour/${item.slug ?? ''}`}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white"
                onClick={() => {
                  localStorage.setItem('tourOperator', item?.operator ?? '');
                  localStorage.setItem('from_cache', String(item?.from_cache ?? ''));
                  localStorage.setItem('tour', JSON.stringify(item));
                  localStorage.setItem('tourOperatorId', String(item?.tour_operator_id ?? ''));
                }}
              >
                <div className="relative h-24 w-full bg-slate-100">
                  {photo ? (
                    <Image src={photo} alt={place} fill className="object-cover" sizes="180px" />
                  ) : null}
                </div>
                <div className="p-2">
                  <p className="truncate text-sm font-semibold text-slate-900">{place}</p>
                  {price && (
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {price} {t('mln')} {t('сум')}
                      <span className="font-medium text-slate-500"> / {t('за человека')}</span>
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
      </div>

      <button
        type="button"
        onClick={openHotTours}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-base font-semibold text-white"
      >
        <Search className="h-4 w-4" />
        {t('lead_more_tours')}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function UzFlag() {
  return (
    <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] border border-slate-200" aria-hidden>
      <span className="flex h-full w-full flex-col">
        <span className="h-1/3 bg-[#0099b5]" />
        <span className="h-1/3 bg-white" />
        <span className="h-1/3 bg-[#1eb53a]" />
      </span>
    </span>
  );
}
