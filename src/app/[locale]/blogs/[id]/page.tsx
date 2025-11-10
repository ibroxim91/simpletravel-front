import { Metadata } from 'next';
import { Locale } from 'next-intl';
import { Suspense } from 'react';
import BlogDetailClient from './BlogDetailClient';

export const dynamic = 'force-dynamic'; // ✅ Har doim dynamic
export const fetchCache = 'force-no-store'; // ✅ Har doim cache yo‘q
export const revalidate = 0;

type Props = {
  params: { locale: Locale; id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = params;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://simple-travel-blond.vercel.app';

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/news/${id}`,
      {
        cache: 'no-store',
      },
    );
    const data = await res.json();
    const blog = data?.data;

    const seoTitle = blog?.title || 'Blog tafsilotlari';
    const seoDescription =
      blog?.text || 'Sayohat va turizm haqidagi blog maqolasi tafsilotlari.';
    const ogImage = blog?.image
      ? blog.image.startsWith('http')
        ? blog.image
        : `${siteUrl}${blog.image}`
      : `${siteUrl}/og-blog-detail.jpg`;

    const canonicalUrl = `${siteUrl}/${locale}/blogs/${id}`;

    return {
      title: seoTitle,
      description: seoDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        type: 'article',
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
    const fallbackTitle = 'Blog tafsilotlari | Simple Travel';
    const fallbackDescription =
      'Sayohat va turizm haqidagi blog maqolasi tafsilotlari.';
    const canonicalUrl = `${siteUrl}/${locale}/blogs/${id}`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: canonicalUrl,
        type: 'article',
        locale,
        siteName: 'Simple Travel',
        images: [
          {
            url: `${siteUrl}/og-blog-detail.jpg`,
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
        images: [`${siteUrl}/og-blog-detail.jpg`],
      },
    };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  return (
    <Suspense>
      <BlogDetailClient />
    </Suspense>
  );
}
