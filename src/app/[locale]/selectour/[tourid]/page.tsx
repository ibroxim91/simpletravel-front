import { BASE_URL } from '@/shared/config/api/URLs';
import { TicketsDetailAPi } from '@/widgets/singletour/lib/api';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import SingleTourClient from './singleTourClient';

type Props = {
  params: { tourid: string };
};

// Dynamic SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tourid } = params;

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
    ogImage: tour?.ticket_images
      ? BASE_URL + tour.ticket_images // string
      : 'https://simpletravel.uz/resources/media/site_settings/navLogo.png',
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
  };
}

export default async function SingleTourPage({ params }: Props) {
  return (
    <Suspense>
      <SingleTourClient />
    </Suspense>
  );
}
