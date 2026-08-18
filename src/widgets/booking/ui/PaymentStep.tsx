'use client';

import Click from '@/assets/Click.png';
import { useRouter } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import { cn } from '@/shared/lib/utils';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import EventRepeatOutlinedIcon from '@mui/icons-material/EventRepeatOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import PaymePayment from '../../../../public/images/payme-payment.png';
import MulticardPayment from '../../../../public/multicard.png';
import { Get_Info, Ticketorder_Api } from '../lib/api';
import formStore from '../lib/hook';
import { downloadOrderVoucherPdf } from './orderPdf';
import PaidModal from './PaidModal';

type Props = {
  onPrev: () => void;
  data: Get_Info | undefined;
  orderId: number | undefined;
};

type PaymentMode = 'full' | 'installment';

const INSTALLMENT_URL =
  process.env.NEXT_PUBLIC_INSTALLMENT_PAYMENT_URL ||
  'https://www.apelsin.uz/open-service?serviceId=498649927';

interface User {
  date: string;
  firstName: string;
  gender: string;
  lastName: string;
  passport: {
    id: number;
    image: string;
  }[];
}

const PAYMENT_PROVIDERS = [
  { id: 'payme', label: 'Payme', logo: PaymePayment.src, size: 40 },
  { id: 'multicard', label: 'Multicard', logo: MulticardPayment.src, size: 60 },
  { id: 'click', label: 'Click', logo: Click.src, size: 60 },
] as const;

export default function PaymentStep({ onPrev, data }: Props) {
  const t = useTranslations();
  const { locale } = useParams();
  const timeData = JSON.parse(localStorage.getItem('timesStepForm') || '{}');
  const participantsData = JSON.parse(
    localStorage.getItem('participantsForm') || '{}',
  );
  const tariff = JSON.parse(localStorage.getItem('info') || '{}');
  const tourData = JSON.parse(localStorage.getItem('tour') || '{}');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isPaidMobile, setIsPaidMobile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const route = useRouter();
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('full');
  const [paymentTypes, setPaymentType] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const order_id = localStorage.getItem('orderId');

  const { mutate, isPending } = useMutation({
    mutationFn: ({ return_url }: { return_url: string }) => {
      return Ticketorder_Api.payments({
        return_url,
        order_id: Number(order_id),
        paymentType: paymentTypes!,
      });
    },
    onSuccess: (res) => {
      route.push(res.data.url);
    },
    onError: () => {
      setError('Произошла ошибка при отправке. Попробуйте ещё раз.');
      toast.error('Произошла ошибка при отправке. Попробуйте ещё раз.');
    },
  });

  const { mutate: downloadPdf, isPending: isPdfDownloading } = useMutation({
    mutationFn: async (body: { order_id: number; lang: LanguageRoutes }) =>
      downloadOrderVoucherPdf({
        orderId: body.order_id,
        locale: body.lang,
        labels: {
          bookingTime: t('Bron qilingan vaqt'),
          hotelAndTransfer: t('Hotel va transfer'),
          tourists: t('Turistlar'),
          stayDates: t('Yashash sanalari'),
          hotelName: t('Отель'),
          mealType: t('Ovqatlanish turi'),
          transferType: t('Transfer turi'),
          roomType: t('Xona turi'),
          receivingCompany: t('Qabul qiluvchi kompaniya'),
          voucher: t('Voucher'),
        },
      }),
    onError: (error: unknown) => {
      console.error('Voucher PDF error:', error);
      toast.error(t('Произошла ошибка при отправке. Попробуйте ещё раз.'));
    },
  });

  const store = formStore();

  const returnUrl =
    process.env.NEXT_PUBLIC_ORDER_RETURN_LINK || 'http://localhost:3000/uz';

  function onSubmitFull() {
    if (!paymentTypes) return;

    setIsPaid(true);
    mutate({ return_url: returnUrl });
  }

  function onSubmitFullMobile() {
    if (!paymentTypes) return;

    setIsPaidMobile(true);
    setSuccess(false);
    mutate({ return_url: returnUrl });
  }

  function onSubmitInstallment() {
    window.open(INSTALLMENT_URL, '_blank', 'noopener,noreferrer');
  }

  const installmentSteps = [
    t('Рассрочка шаг 1'),
    t('Рассрочка шаг 2'),
    t('Рассрочка шаг 3'),
  ];

  const isFullPayDisabled = paymentMode === 'full' && paymentTypes === null;

  return (
    <div className="w-full">
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <p className="text-2xl font-bold text-[#212122]">{t('Оплата')}</p>
        <hr className="h-[2px] my-[24px] bg-[#DFDFDF]" />

        <div className="flex my-5 justify-between flex-col items-start gap-2 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]">
          <h1 className="text-2xl font-bold text-[#212122]">
            {Number(tourData?.price_full).toLocaleString('uz-UZ')} uzs
          </h1>
          <p className="text-[#050B08] font-medium">{t('Общая сумма')}</p>
        </div>

        <p className="text-lg font-semibold text-[#121212] mb-3">
          {t('Выберите тип оплаты')}
        </p>

        <div className="grid grid-cols-2 gap-[16px] max-lg:grid-cols-1 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMode('full')}
            className={cn(
              'cursor-pointer text-left flex flex-col gap-3 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 transition-colors hover:border-[#084FE3]/60',
              paymentMode === 'full'
                ? 'border-[#084FE3] bg-[#F0F4FF]'
                : 'border-[#EDEEF180]',
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#084FE3]/10 flex items-center justify-center">
                  <CreditCardOutlinedIcon sx={{ color: '#084FE3', fontSize: 22 }} />
                </div>
                <p className="text-xl font-bold text-[#212122]">{t('Полная оплата')}</p>
              </div>
              <input
                type="radio"
                readOnly
                checked={paymentMode === 'full'}
                className="w-5 h-5 cursor-pointer accent-[#084FE3]"
              />
            </div>
            <p className="text-sm text-[#646465] pl-[52px]">
              {t('Оплатите всю сумму сразу')}
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMode('installment');
              setPaymentType(null);
            }}
            className={cn(
              'cursor-pointer text-left flex flex-col gap-3 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 transition-colors hover:border-[#7000FF]/60',
              paymentMode === 'installment'
                ? 'border-[#7000FF] bg-[#F7F0FF]'
                : 'border-[#EDEEF180]',
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7000FF]/10 flex items-center justify-center">
                  <EventRepeatOutlinedIcon sx={{ color: '#7000FF', fontSize: 22 }} />
                </div>
                <p className="text-xl font-bold text-[#212122]">{t('Рассрочка')}</p>
              </div>
              <input
                type="radio"
                readOnly
                checked={paymentMode === 'installment'}
                className="w-5 h-5 cursor-pointer accent-[#7000FF]"
              />
            </div>
            <p className="text-sm text-[#646465] pl-[52px]">
              {t('Оформите рассрочку через партнёра')}
            </p>
          </button>
        </div>

        {paymentMode === 'full' && (
          <>
            <label className="text-lg font-semibold text-[#121212]">
              {t('Способ оплаты')}
            </label>
            <div className="grid grid-cols-2 gap-[20px] mt-2 max-lg:grid-cols-1">
              {PAYMENT_PROVIDERS.map((provider) => (
                <label
                  key={provider.id}
                  onClick={() => setPaymentType(provider.id)}
                  htmlFor={`payment-${provider.id}`}
                  className={cn(
                    'cursor-pointer flex items-center gap-[10px] justify-between bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 transition-colors hover:border-[#084FE3]/60',
                    paymentTypes === provider.id
                      ? 'border-[#084FE3] bg-[#F0F4FF]'
                      : 'border-[#EDEEF180]',
                  )}
                >
                  <div className="flex items-center gap-[20px]">
                    <div
                      className="relative rounded-[10px] overflow-hidden"
                      style={{ width: provider.size, height: provider.size }}
                    >
                      <Image
                        src={provider.logo}
                        alt={`${provider.label}-payment`}
                        className="object-cover"
                        fill
                        quality={100}
                      />
                    </div>
                    <p className="text-xl font-bold text-[#212122]">{provider.label}</p>
                  </div>
                  <input
                    type="radio"
                    id={`payment-${provider.id}`}
                    name="payment"
                    checked={paymentTypes === provider.id}
                    onChange={() => setPaymentType(provider.id)}
                    className="w-[20px] h-[20px] cursor-pointer accent-[#084FE3]"
                  />
                </label>
              ))}
            </div>
          </>
        )}

        {paymentMode === 'installment' && (
          <div className="rounded-[20px] border-2 border-[#7000FF]/20 bg-gradient-to-br from-[#F7F0FF] to-[#EDEEF180] p-[24px]">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#7000FF] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div>
                <p className="text-xl font-bold text-[#212122]">{t('Uzum Bank')}</p>
                <p className="text-sm text-[#646465]">{t('Рассрочка через Uzum Bank')}</p>
              </div>
            </div>

            <p className="text-[#212122] mb-4">{t('Рассрочка описание')}</p>

            <ol className="space-y-3 mb-5">
              {installmentSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7000FF] text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-[#212122] text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <div className="flex items-start gap-2 bg-white/70 rounded-xl p-3 text-sm text-[#646465]">
              <OpenInNewOutlinedIcon sx={{ fontSize: 18, color: '#7000FF', mt: '2px' }} />
              <p>{t('Рассрочка предупреждение')}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between max-lg:flex-col gap-3" ref={contentRef}>
        <button
          onClick={onPrev}
          className="bg-gray-200 border shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 py-4 font-medium px-20 cursor-pointer rounded-full mt-[20px]"
        >
          {t('Назад')}
        </button>

        {paymentMode === 'full' ? (
          <>
            <button
              disabled={isFullPayDisabled || isPending}
              onClick={onSubmitFull}
              className={cn(
                'py-4 font-medium px-10 rounded-full mt-[20px] max-lg:hidden',
                isFullPayDisabled || isPending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#1764FC] text-white cursor-pointer hover:bg-[#1250c9]',
              )}
            >
              {t('Перейти к оплате')}
            </button>
            <button
              disabled={isFullPayDisabled || isPending}
              onClick={onSubmitFullMobile}
              className={cn(
                'py-4 font-medium px-10 rounded-full mt-[20px] lg:hidden',
                isFullPayDisabled || isPending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#084FE3] text-white cursor-pointer hover:bg-[#063bc2]',
              )}
            >
              {t('Перейти к оплате')}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onSubmitInstallment}
            className="py-4 font-medium px-10 rounded-full mt-[20px] bg-[#7000FF] text-white cursor-pointer hover:bg-[#5c00d4] flex items-center justify-center gap-2 max-lg:w-full"
          >
            {t('Перейти к рассрочке')}
            <OpenInNewOutlinedIcon sx={{ fontSize: 20 }} />
          </button>
        )}
      </div>

      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] mt-5">
        <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-4 max-lg:items-start">
          <h1 className="text-2xl font-bold text-[#212122]">
            {t('Подробности заказа')}
          </h1>

          <button
            disabled={!order_id || isPdfDownloading}
            onClick={() =>
              downloadPdf({
                lang: locale as LanguageRoutes,
                order_id: Number(order_id),
              })
            }
            className="flex items-center gap-[10px] cursor-pointer px-[15px] py-[10px] border-2 rounded-full border-[#DFDFDF] max-lg:w-full justify-center hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <InsertDriveFileIcon sx={{ color: '#031753' }} />
            <p className="text-[#031753] font-semibold text-lg">
              {isPdfDownloading ? t('Загрузка') : t('Скачать PDF')}
            </p>
          </button>
        </div>

        <h1 className="mt-5 text-lg font-bold text-[#212122]">{t('Дата')}</h1>
        <div className="grid grid-cols-2 w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Откуда')}</p>
          <p className="break-words text-end !text-[#212122]">{timeData.where}</p>
        </div>

        <div className="grid grid-cols-2 w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Куда')}</p>
          <p className="text-[#212122] break-words text-end">{timeData.whereTo}</p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время вылета')}</p>
          <p className="text-[#212122] break-words text-end max-md:px-5">
            {timeData.dispatch && formatDate.format(timeData.dispatch, 'DD-MM-YYYY')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время возвращения')}</p>
          <p className="text-[#212122] text-end break-words max-md:px-5">
            {timeData.returned && formatDate.format(timeData.returned, 'DD-MM-YYYY')}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold text-[#212122]">{t('Мои попутчики')}</h1>
        {participantsData?.participants?.map((e: User, index: number) => (
          <div key={index}>
            <div
              className={cn(
                'grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]',
                index % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white',
              )}
            >
              <p>
                {t('Мои попутчики')} {index + 1}
              </p>
              <p className="text-[#212122] text-end break-words">
                {e.firstName} {e.lastName}
              </p>
            </div>
            <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
              <p className="text-md">{t('Дата рождения')}</p>
              <p className="!text-black text-end break-words max-md:px-5">
                {e.date && formatDate.format(e.date, 'DD-MM-YYYY')}
              </p>
            </div>
          </div>
        ))}

        <h1 className="mt-5 text-lg font-bold text-[#212122]">{t('Турпакет')}</h1>
        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Отель')}</p>
          <p className="text-[#212122] text-end break-words">{data?.data.title}</p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Локация')}</p>
          <p className="text-[#212122] text-end break-words">
            {data?.data.destination?.name}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Рейтинг')}</p>
          <p className="text-[#212122] text-end break-words">
            {data?.data.rating} {t('звёзды')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md break-words">{t('Характеристики')}</p>
          {data?.data.ticket_amenities.slice(0, 1).map((e) => (
            <p className="text-[#212122] text-end break-words" key={e.name}>
              {e.name}...
            </p>
          ))}
        </div>

        {tariff?.transport && (
          <>
            <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
              <p className="text-md">{t('Тип пакета')}</p>
              <p className="text-[#212122] text-end break-words">{tariff.tariff}</p>
            </div>
            <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
              <p className="text-md">{t('Транспорт')}</p>
              <p className="text-[#212122] text-end break-words">
                {tariff.transport.transport.name}
              </p>
            </div>
          </>
        )}

        {store.paidService.length > 0 && (
          <>
            <h1 className="mt-5 text-lg font-bold text-[#212122]">{t('Услуги')}</h1>
            {store.paidService.map((e, i) => (
              <div
                key={e.id || i}
                className={cn(
                  'grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]',
                  i % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white',
                )}
              >
                <p className="text-md">{e.name}</p>
                <p className="text-[#212122] text-end break-words">
                  {formatPrice(e.price, locale as LanguageRoutes, true)}
                </p>
              </div>
            ))}
          </>
        )}

        {store.paidService.length > 0 && (
          <>
            <h1 className="mt-5 text-lg font-bold text-[#212122]">
              {t('Дополнительные услуги')}
            </h1>
            {store.tours_category.map((e, i) => (
              <div
                key={e.id || i}
                className={cn(
                  'grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]',
                  i % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white',
                )}
              >
                <p className="text-md text-[#212122]">{e.name}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <PaidModal
        onClose={() => {
          setIsPaid(false);
          setIsPaidMobile(false);
        }}
        loading={isPending}
        openDrawer={isPaidMobile}
        setOpenDrawer={setIsPaidMobile}
        open={isPaid}
        setSuccess={setSuccess}
        setError={setError}
        success={success}
        error={error}
      />
    </div>
  );
}
