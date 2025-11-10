import LegalOffertaUi from '@/features/legal-offerta/ui/LegalOffertaUi';
import { BASE_URL } from '@/shared/config/api/URLs';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Props = {
  params: { locale: string; type: 'individual' | 'legal_entity' };
};

const getFallbackMeta = (locale: string, type: string) => {
  const isIndividual = type === 'individual';

  switch (locale) {
    case 'uz':
      return {
        title: isIndividual
          ? 'Jismoniy shaxslar uchun taklif | Simple Travel'
          : 'Yuridik shaxslar uchun taklif | Simple Travel',
        description: isIndividual
          ? 'Simple Travel jismoniy shaxslar uchun takliflar va shartlar bilan tanishing.'
          : 'Simple Travel yuridik shaxslar uchun takliflar va shartlar bilan tanishing.',
      };
    case 'ru':
      return {
        title: isIndividual
          ? 'Публичная оферта (Физические лица) | Simple Travel'
          : 'Публичная оферта (Юридические лица) | Simple Travel',
        description: isIndividual
          ? 'Ознакомьтесь с публичной офертой Simple Travel для физических лиц.'
          : 'Ознакомьтесь с публичной офертой Simple Travel для юридических лиц.',
      };
    default:
      return {
        title: isIndividual
          ? 'Public Offer (Individuals) | Simple Travel'
          : 'Public Offer (Legal Entities) | Simple Travel',
        description: isIndividual
          ? 'Explore Simple Travel’s public offer and terms for individuals.'
          : 'Explore Simple Travel’s public offer and terms for legal entities.',
      };
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type } = params;
  const fallback = getFallbackMeta(locale, type);

  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/dashboard/help-page-offerta/?person_type=${type}`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) throw new Error('Failed to fetch offer page');

    const json = await res.json();
    const data = json?.data?.results?.[0];

    const titleFromApi = data?.title?.trim();
    const seo = {
      title: titleFromApi || fallback.title,
      description: fallback.description,
    };

    return {
      title: seo.title,
      description: seo.description,
      openGraph: {
        title: seo.title,
        description: seo.description,
        type: 'article',
        siteName: 'Simple Travel',
        locale,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/legal-offerta/${type}`,
        images: [
          {
            url: `${BASE_URL}/resources/media/site_settings/navLogo.png`,
            width: 1200,
            height: 630,
            alt: seo.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title,
        description: seo.description,
        images: [`${BASE_URL}/resources/media/site_settings/navLogo.png`],
      },
    };
  } catch {
    return {
      title: fallback.title,
      description: fallback.description,
    };
  }
}

export default function PublicOfferPage({ params }: Props) {
  return <LegalOffertaUi type={params.type} />;
}
