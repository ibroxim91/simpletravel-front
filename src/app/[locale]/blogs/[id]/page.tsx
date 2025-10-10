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

export default async function BlogDetailPage({ params }: Props) {
  const { locale, id } = await params;

  // 🔍 Blog ma’lumotlarini oldindan olish (schema uchun)
  const res = await News_Api.getNewsDetail({ id: Number(id) });
  const blog = res?.data?.data;

  const title = blog?.slug || 'Blog maqolasi';
  const description =
    blog?.text || blog?.text || 'Sayohat va turizm haqidagi blog maqolasi';
  const image = blog?.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${blog.image}`
    : '/og-blog-detail.jpg';
  const datePublished = blog?.created || new Date().toISOString();

  // 🧾 JSON-LD structured data
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Organization',
      name:
        locale === 'uz'
          ? 'Turlar sayti'
          : locale === 'ru'
            ? 'Сайт туров'
            : 'Tours Site',
    },
    publisher: {
      '@type': 'Organization',
      name:
        locale === 'uz'
          ? 'Turlar sayti'
          : locale === 'ru'
            ? 'Сайт туров'
            : 'Tours Site',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    datePublished,
    inLanguage: locale,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs/${id}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name:
          locale === 'uz'
            ? 'Bosh sahifa'
            : locale === 'ru'
              ? 'Главная'
              : 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'uz' ? 'Blog' : locale === 'ru' ? 'Блог' : 'Blog',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs/${id}`,
      },
    ],
  };

  return (
    <>
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([blogPostingSchema, breadcrumbSchema]),
        }}
      />

      <main>
        <Suspense>
          <h1 className="sr-only">{title}</h1>
          <BlogDetailClient />
        </Suspense>
      </main>
    </>
  );
}
