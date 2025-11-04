import { News_Api } from '@/features/blogs/lib/api';
import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogDetailClient from './BlogDetailClient';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// 🔥 Dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    // API dan blog ma'lumotini olish
    const res = await News_Api.getNewsDetail({ id: Number(id) });
    const blog = res?.data?.data;

    const title = blog?.slug || 'Blog';
    const description =
      blog?.title || blog?.text || 'Sayohat va turizm haqidagi blog maqolasi';
    const ogImage = blog?.image && `${blog.image}`;

    const siteName =
      locale === 'uz'
        ? 'Turlar sayti'
        : locale === 'ru'
          ? 'Сайт туров'
          : 'Tours Site';

    return {
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
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs/${id}`,
        languages: {
          uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/blogs/${id}`,
          ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/blogs/${id}`,
          en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/blogs/${id}`,
        },
      },
    };
  } catch (error) {
    // API ishlamasa fallback
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
      twitter: {
        card: 'summary_large_image',
        title: 'Blog tafsilotlari',
        description: 'Sayohat va turizm haqidagi blog maqolasi tafsilotlari.',
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-blog-detail.jpg`],
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
