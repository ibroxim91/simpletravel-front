import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogsClient from './BlogsClient';
type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Blog va Yangiliklar | Sayohat va Turizm',
    ru: 'Блог и Новости | Путешествия и Туризм',
    en: 'Blog and News | Travel and Tourism',
  };

  const descriptions = {
    uz: "Sayohat va turizm haqida so'ngi yangiliklar, foydali maslahatlar, sayohat tajribalari va turlar haqida maqolalar.",
    ru: 'Последние новости о путешествиях и туризме, полезные советы, опыт путешествий и статьи о турах.',
    en: 'Latest travel and tourism news, useful tips, travel experiences and articles about tours.',
  };

  const keywords = {
    uz: [
      'sayohat blogi',
      'turizm yangiliklari',
      'sayohat maslahatlari',
      'turlar haqida',
      'sayohat tajribasi',
      'turizm maqolalari',
    ],
    ru: [
      'блог о путешествиях',
      'новости туризма',
      'советы путешественникам',
      'статьи о турах',
      'опыт путешествий',
      'туристические статьи',
    ],
    en: [
      'travel blog',
      'tourism news',
      'travel tips',
      'tour articles',
      'travel experience',
      'tourism articles',
    ],
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
    keywords: keywords[locale as keyof typeof keywords] || keywords.uz,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.uz,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.uz,
      type: 'website',
      locale: locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs`,
      siteName:
        locale === 'uz'
          ? 'Turlar sayti'
          : locale === 'ru'
            ? 'Сайт туров'
            : 'Tours Site',
      images: [
        {
          url: '/Logo_blue.png',
          width: 1200,
          height: 630,
          alt:
            locale === 'uz'
              ? 'Blog va Yangiliklar'
              : locale === 'ru'
                ? 'Блог и Новости'
                : 'Blog and News',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.uz,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.uz,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/blogs`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/blogs`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/blogs`,
      },
    },
  };
}

export default async function Blogs({ params }: Props) {
  const { locale } = await params;

  // Structured Data for Blog
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name:
      locale === 'uz'
        ? 'Sayohat Blogi'
        : locale === 'ru'
          ? 'Блог о путешествиях'
          : 'Travel Blog',
    description:
      locale === 'uz'
        ? "Sayohat va turizm haqida so'ngi yangiliklar va maqolalar"
        : locale === 'ru'
          ? 'Последние новости и статьи о путешествиях и туризме'
          : 'Latest news and articles about travel and tourism',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs`,
    inLanguage: locale,
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
  };

  // Structured Data for BreadcrumbList
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
        name:
          locale === 'uz'
            ? 'Blog va Yangiliklar'
            : locale === 'ru'
              ? 'Блог и Новости'
              : 'Blog and News',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/blogs`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? 'Sayohat va Turizm Blogi'
      : locale === 'ru'
        ? 'Блог о путешествиях и туризме'
        : 'Travel and Tourism Blog';

  return (
    <Suspense>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main>
        <h1 className="sr-only">{h1Text}</h1>
        <BlogsClient />
      </main>
    </Suspense>
  );
}
