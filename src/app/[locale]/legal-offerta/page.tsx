import { getOfferta } from '@/features/legal-offerta/lib/api';
import LegalOffertaUi from '@/features/legal-offerta/ui/LegalOffertaUi';
import { BASE_URL } from '@/shared/config/api/URLs';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string; type: 'legal_entity' };
};

// Tilga qarab SEO meta
const getMetadataByLocale = (locale: string, dataTitle?: string) => {
  switch (locale) {
    case 'uz':
      return {
        title: dataTitle || 'Yuridik shaxslar uchun taklif | Simple Travel',
        description:
          'Simple Travel yuridik shaxslar uchun takliflar va shartlar bilan tanishing.',
      };
    case 'ru':
      return {
        title:
          dataTitle || 'Публичная оферта для юридических лиц | Simple Travel',
        description:
          'Ознакомьтесь с предложениями и условиями Simple Travel для юридических лиц.',
      };
    default:
      return {
        title: dataTitle || 'Public Offer for Legal Entities | Simple Travel',
        description: 'Check Simple Travel offers and terms for legal entities.',
      };
  }
};

// Dynamic SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = params;

  const res = await getOfferta({ person_type: type });
  const data = res.data.data.results[0]; // birinchi faollikni olamiz

  const meta = getMetadataByLocale(locale, data?.title);

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: `${BASE_URL}/resources/media/site_settings/navLogo.png`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${BASE_URL}/resources/media/site_settings/navLogo.png`],
    },
  };
}

export default function LegalOffertaPage({ params }: Props) {
  return <LegalOffertaUi type="legal_entity" />;
}
