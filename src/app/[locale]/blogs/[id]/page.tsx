import { News_Api } from '@/features/blogs/lib/api';
import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogDetailClient from './BlogDetailClient';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// 🧠 SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    // 🔍 Blog ma’lumotini olish (SEO uchun sarlavha, rasm va h.k.)
    const res = await News_Api.getNewsDetail({ id: Number(id) });
    const blog = res?.data?.data;

    const title = blog?.slug || 'Blog';
    const description =
      blog?.title || blog?.text || 'Sayohat va turizm haqidagi blog maqolasi';
    const image = blog?.image
      ? `${process.env.NEXT_PUBLIC_API_URL}${blog.image}`
      : '/og-blog-detail.jpg';

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
            url: image,
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
        images: [image],
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
  } catch {
    return {
      title: 'Blog tafsilotlari | Turlar sayti',
      description: 'Sayohat va turizm haqidagi blog maqolasi tafsilotlari.',
    };
  }
}

export default async function BlogDetailPage() {
  return (
    <>
      <Suspense>
        <BlogDetailClient />
      </Suspense>
    </>
  );
}
