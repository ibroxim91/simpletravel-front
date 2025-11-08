import { TicketsDetailAPi } from '@/widgets/singletour/lib/api';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { Suspense } from 'react';
import SingleTourClient from './singleTourClient';

type Props = {
  params: Promise<{ tourid: string; locale: Locale }>;
};

// Dynamic SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tourid, locale } = await params;

  // API dan ma'lumotni olamiz
  const res = await TicketsDetailAPi.getTicketsDetail({ id: Number(tourid) });
  const tour = res.data.data; // API structure ga qarab o'zgartiring
  const seo = {
    title: tour?.title || 'Тур Simple Travel',
    description:
      tour?.destination ||
      'Откройте для себя лучшие туры с Simple Travel и наслаждайтесь надежным отдыхом.',
    ogTitle: tour?.title || 'Тур Simple Travel',
    ogDescription:
      tour?.destination ||
      'Откройте для себя лучшие туры с Simple Travel и наслаждайтесь надежным отдыхом.',
    ogImage: tour?.ticket_images && tour.ticket_images[0].image, // string
  };

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [seo.ogImage],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
    },
  };
}

export default async function SingleTourPage({ params }: Props) {
  return (
    <Suspense>
      <SingleTourClient />
    </Suspense>
  );
}
