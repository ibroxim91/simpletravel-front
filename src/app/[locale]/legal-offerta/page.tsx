import { getOfferta } from '@/features/legal-offerta/lib/api';
import LegalOffertaUi from '@/features/legal-offerta/ui/LegalOffertaUi';
import { BASE_URL } from '@/shared/config/api/URLs';
import type { Metadata } from 'next';

// ✅ Har doim dinamik bo‘lishi uchun
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Props = {
  params: { locale: string; type: 'legal_entity' };
};

// ✅ Tilga qarab SEO meta
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

// ✅ Dynamic SEO metadata (har safar yangi ma’lumot)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = params;

  try {
    // ⚡️ Har safar yangi so‘rov — cache yo‘q
    const res = await getOfferta({ person_type: type });
    const data = res?.data?.data?.results?.[0];

    const meta = getMetadataByLocale(locale, data?.title);

    return {
      title: meta.title,
      description: meta.description,
      metadataBase: new URL(BASE_URL),
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${BASE_URL}/${locale}/legal-offerta/${type}`,
        type: 'article',
        locale,
        siteName: 'Simple Travel',
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
  } catch {
    const meta = getMetadataByLocale(locale);
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
    };
  }
}

export default function LegalOffertaPage() {
  return <LegalOffertaUi type="legal_entity" />;
}
