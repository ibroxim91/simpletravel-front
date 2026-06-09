import ViewVoucher from '@/widgets/booking/ui/ViewVoucher';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    locale: string;
    order_id: string;
  }>;
};

export default async function ViewVoucherPage({ params }: Props) {
  const { locale, order_id } = await params;
  setRequestLocale(locale);

  const orderId = Number(order_id);
  if (!order_id || Number.isNaN(orderId) || orderId <= 0) {
    notFound();
  }

  return <ViewVoucher orderId={orderId} />;
}
