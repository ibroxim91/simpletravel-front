import RefundPolicyPage from '@/features/legal-documents/ui/RefundPolicyPage';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const title =
    locale === 'uz'
      ? 'Qaytarish qoidalari | Simple Travel'
      : 'Правила возврата | Simple Travel';
  const description =
    locale === 'uz'
      ? 'To‘lov va pul mablag‘larini qaytarish tartibi.'
      : 'Порядок оплаты и возврата денежных средств.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale,
      type: 'article',
      siteName: 'Simple Travel',
    },
  };
}

export default function Page() {
  return <RefundPolicyPage />;
}
