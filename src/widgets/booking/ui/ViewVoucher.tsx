'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Ticketorder_Api } from '../lib/api';
import {
  buildWebVoucherAssets,
  downloadOrderVoucherPdf,
  getTourExtrasFromLocalStorage,
  getVoucherUrl,
  unwrapOrder,
  VoucherDocument,
} from './orderPdf';

export default function ViewVoucher({ orderId }: { orderId: number }) {
  const t = useTranslations();
  const { locale } = useParams();
  const currentLocale = (locale as LanguageRoutes) || LanguageRoutes.UZ;
  const [isDownloading, setIsDownloading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['view-voucher', orderId],
    queryFn: () => Ticketorder_Api.getOrderById({ id: orderId }),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-[#646465]">{t('Загрузка')}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-center text-lg text-[#646465]">
          {t('Voucher topilmadi yoki ruxsat yo‘q')}
        </p>
      </div>
    );
  }

  const order = unwrapOrder(data.data);

  if (!order?.id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-center text-lg text-[#646465]">
          {t('Voucher topilmadi yoki ruxsat yo‘q')}
        </p>
      </div>
    );
  }

  const voucherUrl = getVoucherUrl(order.id, currentLocale);
  const assets = buildWebVoucherAssets(voucherUrl);
  const tourExtras = getTourExtrasFromLocalStorage();
  const printDateTime = dayjs().format('DD.MM.YYYY HH:mm');
  const voucherLabels = {
    voucher: t('Voucher'),
    hotelAndTransfer: t('Hotel va transfer'),
    tourists: t('Turistlar'),
    stayDates: t('Yashash sanalari'),
    hotelName: t('Отель'),
    mealType: t('Ovqatlanish turi'),
    transferType: t('Transfer turi'),
    roomType: t('Xona turi'),
    receivingCompany: t('Qabul qiluvchi kompaniya'),
    bookingTime: t('Bron qilingan vaqt'),
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      await downloadOrderVoucherPdf({
        orderId: order.id,
        locale: currentLocale,
        labels: voucherLabels,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #order-voucher-document,
          #order-voucher-document * {
            visibility: visible;
          }
          #order-voucher-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 794px;
          }
        }
      `}</style>
      <div className="voucher-page-wrapper min-h-screen bg-[#F3F4F6] py-6 print:bg-white print:py-0">
        <div className="voucher-print-toolbar mx-auto mb-4 flex w-full max-w-[860px] justify-end gap-3 px-4 print:hidden">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-full border-2 border-[#DFDFDF] bg-white px-5 py-2.5 text-[#031753] font-semibold shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            <DownloadIcon sx={{ fontSize: 20 }} />
            {isDownloading ? t('Загрузка') : t('Скачать PDF')}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full border-2 border-[#DFDFDF] bg-white px-5 py-2.5 text-[#031753] font-semibold shadow-sm transition-colors hover:bg-gray-50"
          >
            <PrintIcon sx={{ fontSize: 20 }} />
            {t('Chop etish')}
          </button>
        </div>

        <div
          className="w-full overflow-x-auto overscroll-x-contain px-4 pb-4 print:overflow-visible print:px-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="mx-auto w-max print:w-full">
            <div className="min-w-[794px] rounded-[12px] bg-white shadow-[0_4px_24px_rgba(17,34,17,0.08)] print:min-w-0 print:rounded-none print:shadow-none">
              <VoucherDocument
                order={order}
                locale={currentLocale}
                labels={voucherLabels}
                tourExtras={tourExtras}
                printDateTime={printDateTime}
                assets={assets}
                voucherUrl={voucherUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
