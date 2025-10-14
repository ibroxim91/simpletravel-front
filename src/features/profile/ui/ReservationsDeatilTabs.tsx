import Click from '@/assets/Click.png';
import { useRouter } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Button } from '@/shared/ui/button';
import { Ticketorder_Api } from '@/widgets/booking/lib/api';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import PaymePayment from '../../../../public/images/payme-payment.png';
import { User_Api } from '../lib/api';

const ReservationsDeatilTabs = ({
  id,
  setDetail,
}: {
  id: number | null;
  setDetail: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { locale } = useParams();
  const [paymentTypes, setPaymentType] = useState<string | null>(null);
  const t = useTranslations();
  const route = useRouter();
  const { data: store } = useQuery({
    queryKey: ['order_detail', id],
    queryFn: () => User_Api.getOrderId({ id: id! }),
    enabled: !!id,
  });

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
      toast.error('Произошла ошибка при отправке. Попробуйте ещё раз.');
    },
  });

  async function onSubmit() {
    if (store) {
      mutate({
        order_id: store.data.data.id!,
        paymentType: 'click',
        return_url:
          process.env.NEXT_PUBLIC_ORDER_RETURN_LINK ||
          'http://localhost:3000/uz',
      });
    }
  }

  async function onSubmitMobile() {
    if (store) {
      mutate({
        order_id: store.data.data.id!,
        paymentType: 'click',
        return_url:
          process.env.NEXT_PUBLIC_ORDER_RETURN_LINK ||
          'http://localhost:3000/uz',
      });
    }
  }

  const { mutate: downloadPdf } = useMutation({
    mutationFn: (body: { order_id: number | null; lang: string }) =>
      Ticketorder_Api.downloadPdf(body),
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-order-${store?.data.data.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: () => {
      toast.error('Произошла ошибка при отправке. Попробуйте ещё раз.');
    },
  });

  return (
    <>
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[16px] mt-[20px]">
            <div
              onClick={() => setDetail(false)}
              className="w-[40px] h-[40px] cursor-pointer border-2 border-[#DFDFDF] bg-white rounded-full flex items-center justify-center"
            >
              <ChevronLeftIcon sx={{ color: 'black' }} />
            </div>
            <p className="text-2xl font-bold">{t('Оплата')}</p>
          </div>
          <div
            className={clsx(
              'capitalize px-2 py-1 rounded-md text-sm font-medium inline-block',
              store?.data.data.order_status === 'pending_payment'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : store?.data.data.order_status === 'pending_confirmation'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  : store?.data.data.order_status === 'cancelled'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    : store?.data.data.order_status === 'confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : store?.data.data.order_status === 'completed' &&
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            )}
          >
            {store?.data.data.order_status === 'pending_payment'
              ? t('Kutimoqda')
              : store?.data.data.order_status === 'pending_confirmation'
                ? t('Tasdiqlanmoqda')
                : store?.data.data.order_status === 'cancelled'
                  ? t('Bekor qilingan')
                  : store?.data.data.order_status === 'confirmed'
                    ? t('Tasdiqlangan')
                    : store?.data.data.order_status === 'completed' &&
                      t('Tugallangan')}
          </div>
        </div>
        <hr className="h-[2px] my-[24px] bg-[#EDEEF1] " />
        <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
          <p className="text-2xl font-bold">{t('Оплата')}</p>
          <hr className="h-[2px] my-[24px] bg-[#EDEEF1] " />
          <div className="flex my-5 justify-between flex-col items-start gap-2 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]">
            <h1 className="text-2xl font-bold">
              {store?.data.data.total_price &&
                formatPrice(
                  store?.data.data.total_price,
                  locale as LanguageRoutes,
                  true,
                )}
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
                <p className="text-xl font-bold">{t('Payme')}</p>
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
                <p className="text-xl font-bold">Click</p>
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

        <div className="flex justify-between max-lg:flex-col">
          <Button
            onClick={onSubmit}
            disabled={paymentTypes === null}
            className="bg-[#084FE3] max-lg:hidden text-white py-6 font-medium px-10 left-0 cursor-pointer rounded-full mt-[20px]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {t('Загрузка')}...
              </>
            ) : (
              t('Перейти к оплате')
            )}
          </Button>
          <Button
            disabled={paymentTypes === null}
            onClick={onSubmitMobile}
            className="bg-[#084FE3] text-white lg:hidden py-6 font-medium px-10 left-0 cursor-pointer rounded-full mt-[20px]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {t('Загрузка')}...
              </>
            ) : (
              t('Перейти к оплате')
            )}
          </Button>
        </div>
      </div>

      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] mt-5">
        <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-4 max-lg:items-start">
          <h1 className="text-2xl font-bold">{t('Подробности заказа')}</h1>
          <button
            onClick={() =>
              downloadPdf({
                lang: 'uz',
                order_id: store ? store.data.data.id : null,
              })
            }
            className="flex items-center gap-[10px] cursor-pointer px-[15px] py-[10px] border-2 rounded-full border-[#DFDFDF] max-lg:w-full justify-center hover:bg-gray-50 transition-colors"
          >
            <InsertDriveFileIcon sx={{ color: '#031753' }} />
            <p className="text-[#031753] font-semibold text-lg">
              {t('Скачать PDF')}
            </p>
          </button>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Дата')}</h1>
        <div className="grid grid-cols-2 w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Откуда')}</p>
          <p className="!text-black break-words text-end">
            {store?.data.data.departure}
          </p>
        </div>

        <div className="grid grid-cols-2 w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Куда')}</p>
          <p className="!text-black break-words text-end">
            {store?.data.data.ticket.location_name}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время вылета')}</p>
          <p className="!text-black break-words text-end max-md:px-5">
            {store?.data.data.departure_date &&
              formatDate.format(store?.data.data.departure_date, 'DD-MM-YYYY')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время возвращения')}</p>
          <p className="!text-black text-end break-words max-md:px-5">
            {store?.data.data.arrival_time &&
              formatDate.format(store?.data.data.arrival_time, 'DD-MM-YYYY')}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Мои попутчики')}</h1>
        {store?.data.data.participant.map((e, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] 
      ${index % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'}`}
          >
            <p>
              {t('Мои попутчики')} {index + 1}
            </p>
            <p className="!text-black text-end break-words">
              {e.first_name} {e.last_name}
            </p>
          </div>
        ))}

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время возвращения')}</p>
          <p className="!text-black text-end break-words max-md:px-5">
            {store?.data.data.arrival_time &&
              formatDate.format(store?.data.data.arrival_time, 'DD-MM-YYYY')}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Турпакет')}</h1>
        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Отель')}</p>
          <p className="!text-black text-end break-words">
            {store?.data?.data.ticket.title}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Локация')}</p>
          <p className="!text-black text-end break-words">
            {store?.data?.data.destination}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Тип пакета')}</p>
          <p className="!text-black text-end break-words">
            {store?.data.data.tariff}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Транспорт')}</p>
          <p className="!text-black text-end break-words">
            {store?.data.data.transport}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold">{t('Услуги')}</h1>
        {store?.data.data.extra_paid_service.map((e, i) => (
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
        {store?.data.data.extra_service.map((e, i) => (
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
    </>
  );
};

export default ReservationsDeatilTabs;
