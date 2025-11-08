import { getDynamicPageSeo } from '@/shared/lib/getPageSeo';
import type { Metadata } from 'next';
import { Locale } from 'next-intl';
import { ReactNode, Suspense } from 'react';
import SingleTourClient from './singleTourClient';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const seo = await getDynamicPageSeo('/api/v1/tickets/', id, locale);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: [{ url: '/Logos.svg' }],
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [
        {
          url: seo.ogImage!,
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
      images: [seo.ogImage!],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
    },
  };
}

export default async function SingleTourPage() {
  return (
    <Suspense>
      <SingleTourClient />
    </Suspense>
  );
}
