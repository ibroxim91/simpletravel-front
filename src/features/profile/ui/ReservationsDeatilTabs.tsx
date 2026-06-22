import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Ticketorder_Api } from '@/widgets/booking/lib/api';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { SamoTicketOrder, User_Api } from '../lib/api';

const ReservationsDeatilTabs = ({
  id,
  setDetail,
}: {
  id: number | null;
  setDetail: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { locale } = useParams();
  const t = useTranslations();
  const { data: store } = useQuery({
    queryKey: ['order_detail', id],
    queryFn: () => User_Api.getOrderId({ id: id! }),
    enabled: !!id,
  });

  const order: SamoTicketOrder | undefined =
    store?.data && 'id' in store.data
      ? store.data
      : store?.data?.data;

  const { mutate: downloadPdf } = useMutation({
    mutationFn: (body: { order_id: number | null; lang: string }) =>
      Ticketorder_Api.downloadPdf(body),
    onSuccess: (res) => {
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-order-${order?.id}.pdf`;
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
            order?.order_status === 'pending_payment'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              : order?.order_status === 'pending_confirmation'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                : order?.order_status === 'cancelled'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  : order?.order_status === 'confirmed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : order?.order_status === 'completed' &&
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
          )}
        >
          {order?.order_status === 'pending_payment'
            ? t('Kutimoqda')
            : order?.order_status === 'pending_confirmation'
              ? t('Tasdiqlanmoqda')
              : order?.order_status === 'cancelled'
                ? t('Bekor qilingan')
                : order?.order_status === 'confirmed'
                  ? t('Tasdiqlangan')
                  : order?.order_status === 'completed' && t('Tugallangan')}
        </div>
      </div>
      <hr className="h-[2px] my-[24px] bg-[#EDEEF1] " />
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <p className="text-2xl font-bold">{t('Оплата')}</p>
        <hr className="h-[2px] my-[24px] bg-[#DFDFDF] " />
        <div className="flex my-5 justify-between flex-col items-start gap-2 bg-[#EDEEF180] p-[20px] rounded-[20px] border-2 border-[#EDEEF180]">
          <h1 className="text-2xl font-bold text-[#212122]">
            {order?.total_price &&
              formatPrice(
                order.total_price,
                locale as LanguageRoutes,
                true,
              )}
          </h1>
          <p className="text-[#050B08] font-medium">{t('Общая сумма')}</p>
        </div>
      </div>

      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] mt-5">
        <div className="flex items-center justify-between max-lg:flex-col max-lg:gap-4 max-lg:items-start">
          <h1 className="text-2xl font-bold text-[#212122]">
            {t('Подробности заказа')}
          </h1>
          <button
            onClick={() =>
              downloadPdf({ lang: locale as LanguageRoutes, order_id: id! })
            }
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
          <p className="break-words text-end !text-[#212122]">
            {order?.departure_name}
          </p>
        </div>

        <div className="grid grid-cols-2 w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Куда')}</p>
          <p className="text-[#212122] break-words text-end">
            {order?.destination_name}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время вылета')}</p>
          <p className="text-[#212122] break-words text-end max-md:px-5">
            {order?.check_in_date &&
              formatDate.format(order.check_in_date, 'DD-MM-YYYY')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Время возвращения')}</p>
          <p className="text-[#212122] text-end break-words max-md:px-5">
            {order?.check_out_date &&
              formatDate.format(order.check_out_date, 'DD-MM-YYYY')}
          </p>
        </div>

        <h1 className="mt-5 text-lg font-bold text-[#212122]">
          {t('Мои попутчики')}
        </h1>
        {order?.participant.map((e, index) => (
          <div key={e.id ?? index}>
            <div
              className={`grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465] 
              ${index % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white'}`}
            >
              <p>
                {t('Мои попутчики')} {index + 1}
              </p>
              <p className="text-[#212122] text-end break-words">
                {e.first_name} {e.last_name}
              </p>
            </div>
          </div>
        ))}

        <h1 className="mt-5 text-lg font-bold text-[#212122]">
          {t('Турпакет')}
        </h1>
        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Отель')}</p>
          <p className="text-[#212122] text-end break-words">
            {order?.hotel_name}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Локация')}</p>
          <p className="text-[#212122] text-end break-words">
            {order?.destination_name}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Рейтинг')}</p>
          <p className="text-[#212122] text-end break-words">
            {order?.rating} {t('звёзды')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Тип пакета')}</p>
          <p className="text-[#212122] text-end break-words">
            {order?.meal_plan}
          </p>
        </div>

        <div className="grid grid-cols-2 items-center justify-between w-full my-2 bg-[#EDEEF1] px-[8px] py-[5px] rounded-[8px] text-[#646465]">
          <p className="text-md">{t('Тур оператор')}</p>
          <p className="text-[#212122] text-end break-words">
            {order?.tour_operator}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationsDeatilTabs;
