'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import PaymePayment from '../../../../public/images/payme-payment.png';
import UzumPayment from '../../../../public/images/uzum-payment.png';
import { Get_Info } from '../lib/api';
import formStore from '../lib/hook';
import PaidModal from './PaidModal';

type Props = {
  onPrev: () => void;
  data: Get_Info | undefined;
};

export default function PaymentStep({ onPrev, data }: Props) {
  const t = useTranslations();
  const { locale } = useParams();
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isPaidMobile, setIsPaidMobile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { where, whereTo, dispatch, returned, user, transport, tariff } =
    formStore();

  const store = formStore();

  async function onSubmit() {
    setLoading(true);
    setIsPaid(true);
    setSuccess(false);
    setError(null);
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('ok');
        }, 2000);
      });
      setLoading(false);
      setSuccess(true);
    } catch {
      setLoading(false);
      setError('Произошла ошибка при отправке. Попробуйте ещё раз.');
    }
  }

  async function onSubmitMobile() {
    setLoading(true);
    setIsPaidMobile(true);
    setSuccess(false);

    setError(null);
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('ok');
        }, 2000);
      });
      setLoading(false);
      setSuccess(true);
    } catch {
      setLoading(false);
      setError('Произошла ошибка при отправке. Попробуйте ещё раз.');
    }
  }

  return (
    <div className="w-full">
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <p className="text-2xl font-bold">{t('Оплата')}</p>
        <hr className="h-[2px] my-[24px] bg-[#EDEEF1] " />
        <div className="flex my-5 justify-between flex-col items-start gap-2 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]">
          <h1 className="text-2xl font-bold">
            {store.total_price &&
              formatPrice(store.total_price, locale as LanguageRoutes, true)}
          </h1>
          <p className="text-[#050B08] font-medium">{t('Общая сумма')}</p>
        </div>

        <label className="text-lg font-semibold text-[#121212]">
          {t('Способ оплаты')}
        </label>
        <div className="grid grid-cols-2 gap-[20px] mt-2 max-lg:grid-cols-1">
          <label
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
          </label>

          <label
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
              <p className="text-xl font-bold">{t('Payme')}</p>
            </div>
            <input
              type="radio"
              id="payment-uzum"
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
          onClick={onSubmit}
          className="bg-[#084FE3] max-lg:hidden text-white py-4 font-medium px-10 left-0 cursor-pointer rounded-full mt-[20px]"
        >
          {t('Перейти к оплате')}
        </button>
        <button
          onClick={onSubmitMobile}
          className="bg-[#084FE3] text-white lg:hidden py-4 font-medium px-10 left-0 cursor-pointer rounded-full mt-[20px]"
        >
          {t('Перейти к оплате')}
        </button>
      </div>

      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] mt-5">
        <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-4 max-lg:items-start">
          <h1 className="text-2xl font-bold">{t('Подробности заказа')}</h1>
          <button className="flex items-center gap-[10px] cursor-pointer px-[15px] py-[10px] border-2 rounded-full border-[#DFDFDF] max-lg:w-full justify-center hover:bg-gray-50 transition-colors">
            <InsertDriveFileIcon sx={{ color: '#031753' }} />
            <p className="text-[#031753] font-semibold text-lg">
              {t('Скачать PDF')}
            </p>
          </button>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Дата')}</h1>
        <div className="grid grid-cols-2 w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Откуда')}</p>
          <p className="!text-black break-words text-end">{where}</p>
        </div>

        <div className="grid grid-cols-2 w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Куда')}</p>
          <p className="!text-black break-words text-end">{whereTo}</p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время вылета')}</p>
          <p className="!text-black break-words text-end max-md:px-5">
            {dispatch && formatDate.format(dispatch, 'DD-MM-YYYY')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время возвращения')}</p>
          <p className="!text-black text-end break-words max-md:px-5">
            {returned && formatDate.format(returned, 'DD-MM-YYYY')}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Мои попутчики')}</h1>
        {user.map((e, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] 
      ${index % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'}`}
          >
            <p>
              {t('Мои попутчики')} {index + 1}
            </p>
            <p className="!text-black text-end break-words">
              {e.firstName} {e.lastName}
            </p>
          </div>
        ))}

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время возвращения')}</p>
          <p className="!text-black text-end break-words max-md:px-5">
            {returned && formatDate.format(returned, 'DD-MM-YYYY')}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Турпакет')}</h1>
        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Отель')}</p>
          <p className="!text-black text-end break-words">{data?.data.title}</p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Локация')}</p>
          <p className="!text-black text-end break-words">
            {data?.data.destination}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Рейтинг')}</p>
          <p className="!text-black text-end break-words">
            {data?.data.rating} {t('звёзды')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md break-words">{t('Характеристики')}</p>
          {data?.data.ticket_amenities.slice(0, 1).map((e) => (
            <p className="!text-black text-end break-words" key={e.name}>
              {e.name}...
            </p>
          ))}
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Тип пакета')}</p>
          <p className="!text-black text-end break-words">{tariff.name}</p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Транспорт')}</p>
          <p className="!text-black text-end break-words">{transport}</p>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Услуги')}</h1>
        {store.paidService.map((e, i) => (
          <div
            key={e.id || i}
            className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] ${
              i % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'
            }`}
          >
            <p className="text-md">{e.name}</p>
            <p className="!text-black text-end break-words">
              {formatPrice(e.price, locale as LanguageRoutes, true)}
            </p>
          </div>
        ))}

        <h1 className="mt-5 text-lg font-bold">{t('Дополнительные услуги')}</h1>
        {store.tours_category.map((e, i) => (
          <div
            key={e.id || i}
            className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] ${
              i % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'
            }`}
          >
            <p className="text-md">{e.name}</p>
            {/* <p className="!text-black text-end break-words">
              {formatPrice('1450000', locale as LanguageRoutes, true)}
            </p> */}
          </div>
        ))}
      </div>

      <PaidModal
        onClose={() => {
          setIsPaid(false);
          setIsPaidMobile(false);
        }}
        loading={loading}
        openDrawer={isPaidMobile}
        setOpenDrawer={setIsPaidMobile}
        open={isPaid}
        setSuccess={setSuccess}
        setLoading={setLoading}
        setError={setError}
        success={success}
        error={error}
      />
    </div>
  );
}
