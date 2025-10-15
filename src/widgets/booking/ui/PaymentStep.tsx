'use client';

import Click from '@/assets/Click.png';
import { useRouter } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import PaymePayment from '../../../../public/images/payme-payment.png';
import { Get_Info, Ticketorder_Api } from '../lib/api';
import formStore from '../lib/hook';
import PaidModal from './PaidModal';

type Props = {
  onPrev: () => void;
  data: Get_Info | undefined;
  orderId: number | undefined;
};

export default function PaymentStep({ onPrev, data, orderId }: Props) {
  const t = useTranslations();
  const { locale } = useParams();
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isPaidMobile, setIsPaidMobile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const route = useRouter();
  const [paymentTypes, setPaymentType] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { where, whereTo, dispatch, returned, user, transport, tariff } =
    formStore();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      order_id,
      return_url,
    }: {
      paymentType: string;
      return_url: string;
      order_id: number;
    }) => {
      return Ticketorder_Api.payments({
        return_url,
        order_id,
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

  const { mutate: downloadPdf } = useMutation({
    mutationFn: (body: { order_id: number; lang: string }) =>
      Ticketorder_Api.downloadPdf(body),
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-order-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error('Произошла ошибка при отправке. Попробуйте ещё раз.');
    },
  });

  const store = formStore();

  async function onSubmit() {
    setIsPaid(true);
    mutate({
      order_id: orderId!,
      paymentType: 'click',
      return_url:
        process.env.NEXT_PUBLIC_ORDER_RETURN_LINK || 'http://localhost:3000/uz',
    });
  }

  async function onSubmitMobile() {
    setIsPaidMobile(true);
    setSuccess(false);

    mutate({
      order_id: orderId!,
      paymentType: 'click',
      return_url:
        process.env.NEXT_PUBLIC_ORDER_RETURN_LINK || 'http://localhost:3000/uz',
    });
  }

  return (
    <div className="w-full">
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <p className="text-2xl font-bold text-[#212122]">{t('Оплата')}</p>
        <hr className="h-[2px] my-[24px] bg-[#DFDFDF] " />
        <div className="flex my-5 justify-between flex-col items-start gap-2 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]">
          <h1 className="text-2xl font-bold text-[#212122]">
            {store.total_price &&
              formatPrice(store.total_price, locale as LanguageRoutes, true)}
          </h1>
          <p className="text-[#050B08] font-medium">{t('Общая сумма')}</p>
        </div>

        <label className="text-lg font-semibold text-[#121212]">
          {t('Способ оплаты')}
        </label>
        <div className="grid grid-cols-2 gap-[20px] mt-2 max-lg:grid-cols-1">
          {/* <label
            htmlFor="payment-payme"
            className="cursor-pointer flex items-center gap-[10px] justify-between bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]"
          >
            <div className="flex items-center gap-[20px]">
              <div className="w-[40px] h-[40px] relative rounded-[10px] overflow-hidden">
                <Image
                  src={UzumPayment.src}
                  alt="uzum-payment"
                  className="object-cover"
                  fill
                  quality={100}
                />
              </div>
              <p className="text-xl font-bold">{t('Uzum bank')}</p>
            </div>
            <input
              type="radio"
              id="payment-payme"
              name="payment"
              className="w-[20px] h-[20px] border-2 border-[#EDEEF180] cursor-pointer"
            />
          </label> */}

          <label
            onClick={() => setPaymentType('payme')}
            htmlFor="payment-uzum"
            className="cursor-pointer flex items-center gap-[10px] justify-between bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]"
          >
            <div className="flex items-center gap-[20px]">
              <div className="w-[40px] h-[40px] relative rounded-[10px] overflow-hidden">
                <Image
                  src={PaymePayment.src}
                  alt="payme-payment"
                  className="object-cover"
                  fill
                  quality={100}
                />
              </div>
              <p className="text-xl font-bold text-[#212122]">{t('Payme')}</p>
            </div>
            <input
              type="radio"
              id="payment-uzum"
              name="payment"
              className="w-[20px] h-[20px] border-2 border-[#EDEEF180] cursor-pointer"
            />
          </label>

          <label
            onClick={() => setPaymentType('click')}
            htmlFor="payment-click"
            className="cursor-pointer flex items-center gap-[10px] justify-between bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]"
          >
            <div className="flex items-center gap-[20px]">
              <div className="w-[60px] h-[60px] relative rounded-[10px] overflow-hidden">
                <Image
                  src={Click.src}
                  alt="payme-click"
                  className="object-cover"
                  fill
                  quality={100}
                />
              </div>
              <p className="text-xl font-bold text-[#212122]">Click</p>
            </div>
            <input
              type="radio"
              id="payment-click"
              name="payment"
              className="w-[20px] h-[20px] border-2 border-[#EDEEF180] cursor-pointer"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-between max-lg:flex-col" ref={contentRef}>
        <button
          onClick={onPrev}
          className="bg-gray-200 border shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 py-4 font-medium px-20 left-0 cursor-pointer rounded-full mt-[20px]"
        >
          {t('Назад')}
        </button>
        <button
          disabled={paymentTypes === null}
          onClick={onSubmit}
          className={`py-4 font-medium px-10 left-0 rounded-full mt-[20px] max-lg:hidden
    ${
      paymentTypes === null
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-[#1764FC] text-white cursor-pointer hover:bg-[#1764FC]'
    }`}
        >
          {t('Перейти к оплате')}
        </button>

        <button
          disabled={paymentTypes === null}
          onClick={onSubmitMobile}
          className={`py-4 font-medium px-10 left-0 rounded-full mt-[20px] lg:hidden 
    ${
      paymentTypes === null
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-[#084FE3] text-white cursor-pointer hover:bg-[#063bc2]'
    }`}
        >
          {t('Перейти к оплате')}
        </button>
      </div>

      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] mt-5">
        <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-4 max-lg:items-start">
          <h1 className="text-2xl font-bold text-[#212122]">
            {t('Подробности заказа')}
          </h1>
          <button
            onClick={() => downloadPdf({ lang: 'uz', order_id: orderId! })}
            className="flex items-center gap-[10px] cursor-pointer px-[15px] py-[10px] border-2 rounded-full border-[#DFDFDF] max-lg:w-full justify-center hover:bg-gray-50 transition-colors"
          >
            <InsertDriveFileIcon sx={{ color: '#031753' }} />
            <p className="text-[#031753] font-semibold text-lg">
              {t('Скачать PDF')}
            </p>
          </button>
        </div>

        <h1 className="mt-5 text-lg font-bold text-[#212122]">{t('Дата')}</h1>
        <div className="grid grid-cols-2 w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Откуда')}</p>
          <p className="break-words text-end !text-[#212122]">{where}</p>
        </div>

        <div className="grid grid-cols-2 w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Куда')}</p>
          <p className="text-[#212122] break-words text-end">{whereTo}</p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время вылета')}</p>
          <p className="text-[#212122] break-words text-end max-md:px-5">
            {dispatch && formatDate.format(dispatch, 'DD-MM-YYYY')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время возвращения')}</p>
          <p className="text-[#212122] text-end break-words max-md:px-5">
            {returned && formatDate.format(returned, 'DD-MM-YYYY')}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold text-[#212122]">
          {t('Мои попутчики')}
        </h1>
        {user.map((e, index) => (
          <>
            <div
              key={index}
              className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] 
              ${index % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'}`}
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
                {e.birthDate && formatDate.format(e.birthDate, 'DD-MM-YYYY')}
              </p>
            </div>
          </>
        ))}

        <h1 className="mt-5 text-lg font-bold text-[#212122]">
          {t('Турпакет')}
        </h1>
        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Отель')}</p>
          <p className="text-[#212122] text-end break-words">
            {data?.data.title}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Локация')}</p>
          <p className="text-[#212122] text-end break-words">
            {data?.data.destination}
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

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Тип пакета')}</p>
          <p className="text-[#212122] text-end break-words">{tariff.name}</p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Транспорт')}</p>
          <p className="text-[#212122] text-end break-words">{transport}</p>
        </div>

        {store.paidService.length > 0 && (
          <>
            <h1 className="mt-5 text-lg font-bold text-[#212122]">
              {t('Услуги')}
            </h1>
            {store.paidService.map((e, i) => (
              <div
                key={e.id || i}
                className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] ${
                  i % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'
                }`}
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
                className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] ${
                  i % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'
                }`}
              >
                <p className="text-md text-[#212122]">{e.name}</p>
                {/* <p className="!text-black text-end break-words">
              {formatPrice('1450000', locale as LanguageRoutes, true)}
              </p> */}
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
