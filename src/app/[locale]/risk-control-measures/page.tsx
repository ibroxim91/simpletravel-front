import RiskControlPage from '@/features/legal-documents/ui/RiskControlPage';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const title =
    locale === 'uz'
      ? 'Risk Control Measures | Simple Travel'
      : 'Меры по рискам | Simple Travel';
  const description =
    locale === 'uz'
      ? 'Firibgarlik operatsiyalari xavfini cheklash va nazorat qilish choralari.'
      : 'Меры по ограничению и контролю рисков мошеннических операций.';

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
  return <RiskControlPage />;
}
