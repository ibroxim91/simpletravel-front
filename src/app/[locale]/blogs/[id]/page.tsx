import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogDetailClient from './BlogDetailClient';

// ✅ Har doim dynamic render
export const dynamic = 'force-dynamic';

// ✅ Har doim cache'ni o‘chirib qo‘yish
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Props = {
  params: { locale: string; id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = params;

  try {
    // ✅ cache yo‘q, har safar yangi ma’lumot
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/news/${id}`,
      { cache: 'no-store' },
    );

    const data = await res.json();
    const blog = data?.data;

    const title = blog?.title || 'Blog tafsilotlari';
    const description =
      blog?.text || 'Sayohat va turizm haqidagi blog maqolasi tafsilotlari.';
    const ogImage = blog?.image
      ? `${process.env.NEXT_PUBLIC_SITE_URL}${blog.image}`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/og-blog-detail.jpg`;

    const siteName =
      locale === 'uz'
        ? 'Turlar sayti'
        : locale === 'ru'
          ? 'Сайт туров'
          : 'Tours Site';

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
      title: `${title} | ${siteName}`,
      description,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs/${id}`,
        type: 'article',
        locale,
        siteName,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    return {
      title: 'Blog tafsilotlari | Turlar sayti',
      description: 'Sayohat va turizm haqidagi blog maqolasi tafsilotlari.',
      openGraph: {
        title: 'Blog tafsilotlari',
        description: 'Sayohat va turizm haqidagi blog maqolasi tafsilotlari.',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-blog-detail.jpg`,
            width: 1200,
            height: 630,
            alt: 'Blog tafsilotlari',
          },
        ],
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
