import { News_Api } from '@/features/blogs/lib/api';
import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { Suspense } from 'react';
import BlogDetailClient from './BlogDetailClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const idFromSlug = Array.isArray(id)
    ? Number(id[id.length - 1].split('-').pop())
    : id
      ? Number(id.split('-').pop())
      : undefined;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://simple-travel-blond.vercel.app';

  try {
    const res = await News_Api.getNewsDetail({ id: Number(idFromSlug) });
    const tour = res?.data?.data;

    if (!tour) {
      throw new Error('Tour not found');
    }

    const ogImage = tour.image?.startsWith('http')
      ? tour.image
      : `${siteUrl}${tour.image || '/Logo_blue.png'}`;

    const seoTitle =
      tour.title || tour.slug || 'Simple Travel – Sayohatlar va turlar';
    const seoDescription =
      tour.text ||
      "Eng yaxshi sayohatlar, mashhur yo'nalishlar va issiq turlar Simple Travel'da!";

    const canonicalUrl = `${siteUrl}/${locale}/blogs/${id}`;

    return {
      title: seoTitle,
      description: seoDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        type: 'article', // website o'rniga article
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
    console.error('Metadata generation error:', error);

    const fallbackTitle = 'Simple Travel – Sayohatlar va turlar';
    const fallbackDescription =
      "Eng yaxshi sayohatlar, mashhur yo'nalishlar va issiq turlar Simple Travel'da!";
    const canonicalUrl = `${siteUrl}/${locale}/blogs/${id}`;

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

export default async function BlogDetailPage() {
  return (
    <Suspense>
      <BlogDetailClient />
    </Suspense>
  );
}
