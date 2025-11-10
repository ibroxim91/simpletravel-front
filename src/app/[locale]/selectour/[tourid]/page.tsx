import { TicketsDetailAPi } from '@/widgets/singletour/lib/api';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { Suspense } from 'react';
import SingleTourClient from './singleTourClient';

export const dynamic = 'force-dynamic'; // ✅ dynamic SEO
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Props = {
  params: { tourid: string; locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tourid, locale } = params;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://simple-travel-blond.vercel.app';

  try {
    const res = await TicketsDetailAPi.getTicketsDetail({ id: Number(tourid) });
    const tour = res?.data?.data;

    const ogImage = tour?.ticket_images?.[0]?.image?.startsWith('http')
      ? tour.ticket_images[0].image
      : `${siteUrl}${tour.ticket_images?.[0]?.image || '/Logo_blue.png'}`;

    const seoTitle = tour?.title || 'Simple Travel – Sayohatlar va turlar';
    const seoDescription =
      tour?.destination ||
      'Eng yaxshi sayohatlar, mashhur yo‘nalishlar va issiq turlar Simple Travel’da!';
    const canonicalUrl = `${siteUrl}/${locale}/tours/${tourid}`;

    return {
      title: seoTitle,
      description: seoDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        type: 'website',
        locale,
        siteName: 'Simple Travel',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: seoTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error('generateMetadata error:', error);

    // fallback SEO
    const fallbackTitle = 'Simple Travel – Sayohatlar va turlar';
    const fallbackDescription =
      'Eng yaxshi sayohatlar, mashhur yo‘nalishlar va issiq turlar Simple Travel’da!';
    const canonicalUrl = `${siteUrl}/${locale}/tours/${tourid}`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: canonicalUrl,
        type: 'website',
        locale,
        siteName: 'Simple Travel',
        images: [
          {
            url: `${siteUrl}/Logo_blue.png`,
            width: 1200,
            height: 630,
            alt: fallbackTitle,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: fallbackTitle,
        description: fallbackDescription,
        images: [`${siteUrl}/Logo_blue.png`],
      },
    };
  }
}

export default async function SingleTourPage({ params }: Props) {
  return (
    <Suspense>
      <SingleTourClient />
    </Suspense>
  );
}
