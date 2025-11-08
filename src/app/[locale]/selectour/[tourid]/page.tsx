import getLocaleCS from '@/shared/lib/getLocaleCS';
import { getDynamicPageSeo } from '@/shared/lib/getPageSeo';
import { TicketsDetailAPi } from '@/widgets/singletour/lib/api';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import SingleTourClient from './singleTourClient';

type Props = {
  params: { tourid: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tourid } = params;
  const language = getLocaleCS();
  try {
    const seo = await getDynamicPageSeo(
      '/api/v1/tickets/',
      tourid,
      language,
      3600,
    );

    if (seo.title === 'Sayohatlar va Turlar | Eng yaxshi narxlarda') {
      const res = await TicketsDetailAPi.getTicketsDetail({
        id: Number(tourid),
      });
      const tour = res.data.data;

      return {
        title: tour?.title || 'Тур Simple Travel',
        description:
          tour?.destination ||
          'Откройте для себя лучшие туры с Simple Travel и наслаждайтесь надежным отдыхом.',
        openGraph: {
          title: tour?.title || 'Тур Simple Travel',
          description:
            tour?.destination ||
            'Откройте для себя лучшие туры с Simple Travel и наслаждайтесь надежным отдыхом.',
          images: [
            {
              url: tour?.ticket_images?.[0]?.image || '/Logo_blue.png',
              width: 1200,
              height: 630,
              alt: tour?.title || 'Tour Image',
            },
          ],
          type: 'website',
          locale: 'uz_UZ',
        },
        twitter: {
          card: 'summary_large_image',
          title: tour?.title || 'Тур Simple Travel',
          description:
            tour?.destination ||
            'Откройте для себя лучшие туры с Simple Travel и наслаждайтесь надежным отдыхом.',
          images: [tour?.ticket_images?.[0]?.image || '/Logo_blue.png'],
        },
      };
    }

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        images: [
          {
            url: seo.ogImage || '/Logo_blue.png',
            width: 1200,
            height: 630,
            alt: seo.ogTitle || seo.title,
          },
        ],
        type: 'website',
        locale: 'uz_UZ',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        images: [seo.ogImage || '/Logo_blue.png'],
      },
      alternates: {
        canonical: `https://your-domain.com/tours/${tourid}`,
        languages: {
          uz: `/uz/tours/${tourid}`,
          ru: `/ru/tours/${tourid}`,
          en: `/en/tours/${tourid}`,
        },
      },
    };
  } catch (error) {
    return {
      title: 'Тур Simple Travel',
      description:
        'Откройте для себя лучшие туры с Simple Travel и наслаждайтесь надежным отдыхом.',
      openGraph: {
        title: 'Тур Simple Travel',
        description: 'Откройте для себя лучшие туры с Simple Travel',
        images: ['/Logo_blue.png'],
      },
    };
  }
}

export default async function SingleTourPage() {
  return (
    <Suspense>
      <SingleTourClient />
    </Suspense>
  );
}
