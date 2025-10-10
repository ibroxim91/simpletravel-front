import { PRODUCT_INFO } from '@/shared/constants/data';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ContactClient from './contactClient';

// 🧠 Tilga qarab SEO metadatalarini olish
const getMetadataByLocale = (locale: string) => {
  switch (locale) {
    case 'uz':
      return {
        title: 'Kontaktlar | Simple Travel',
        description:
          'Biz bilan bog‘laning — Simple Travel kompaniyasi sizga sayohatlar, turlar va xizmatlar haqida to‘liq ma’lumot beradi.',
      };
    case 'ru':
      return {
        title: 'Контакты | Simple Travel',
        description:
          'Свяжитесь с нами — компания Simple Travel предоставит полную информацию о турах, путешествиях и услугах.',
      };
    default:
      return {
        title: 'Contacts | Simple Travel',
        description:
          'Contact us — Simple Travel provides full information about tours, trips, and services.',
      };
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = getMetadataByLocale(locale);

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/contacts`;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: 'website',
      siteName: PRODUCT_INFO.name,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  };
}

// 🧱 Page komponenti
export default function Page() {
  return (
    <Suspense>
      <div className="bg-[#EDEEF1] min-h-screen">
        <ContactClient />
      </div>
    </Suspense>
  );
}
