import type { Metadata } from 'next';
import { Suspense } from 'react';
import SavedClient from './savedClient';

type Props = {
  params: Promise<{ locale: string }>;
};

// 🧠 SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Saqlangan turlar | Sayohat kompaniyasi',
    ru: 'Сохранённые туры | Туристическая компания',
    en: 'Saved Tours | Travel Company',
  };

  const descriptions = {
    uz: 'Siz saqlagan turlarni bu yerda ko‘rishingiz va ularga qaytishingiz mumkin. Sevimli sayohatlaringizni boshqaring va yangi turlarni toping.',
    ru: 'Здесь вы можете просмотреть и управлять своими сохранёнными турами. Возвращайтесь к любимым путешествиям и открывайте новые.',
    en: 'View and manage your saved tours. Revisit your favorite travels and discover new destinations.',
  };

  const keywords = {
    uz: [
      'saqlangan turlar',
      'sevimli turlar',
      'sayohatlar',
      'online turlar',
      'turizm',
      'travel favourites',
    ],
    ru: [
      'сохранённые туры',
      'избранные туры',
      'путешествия',
      'туризм',
      'любимые поездки',
    ],
    en: [
      'saved tours',
      'favourite tours',
      'travel',
      'online trips',
      'tourism',
      'vacations',
    ],
  };

  const ogTitles = titles;
  const ogDescriptions = descriptions;

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
    keywords: keywords[locale as keyof typeof keywords] || keywords.uz,
    openGraph: {
      title: ogTitles[locale as keyof typeof ogTitles] || ogTitles.uz,
      description:
        ogDescriptions[locale as keyof typeof ogDescriptions] ||
        ogDescriptions.uz,
      type: 'website',
      locale: locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/saved`,
      siteName:
        locale === 'uz'
          ? 'Sayohat kompaniyasi'
          : locale === 'ru'
            ? 'Туристическая компания'
            : 'Travel Company',
      images: [
        {
          url: '/Logo_blue.png',
          width: 1200,
          height: 630,
          alt:
            locale === 'uz'
              ? 'Saqlangan turlar va sevimlilar'
              : locale === 'ru'
                ? 'Сохранённые туры и избранные'
                : 'Saved tours and favourites',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitles[locale as keyof typeof ogTitles] || ogTitles.uz,
      description:
        ogDescriptions[locale as keyof typeof ogDescriptions] ||
        ogDescriptions.uz,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/saved`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/saved`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/saved`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/saved`,
      },
    },
  };
}

// 📘 Page Component
export default async function SavedPage({ params }: Props) {
  const { locale } = await params;

  // ✅ Structured Data for Saved Page
  const savedSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name:
      locale === 'uz'
        ? 'Saqlangan turlar'
        : locale === 'ru'
          ? 'Сохранённые туры'
          : 'Saved Tours',
    description:
      locale === 'uz'
        ? 'Foydalanuvchi tomonidan saqlangan sevimli turlar sahifasi.'
        : locale === 'ru'
          ? 'Страница с избранными турами пользователя.'
          : 'Page showing user’s saved favourite tours.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/saved`,
    inLanguage: locale,
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
        name:
          locale === 'uz'
            ? 'Saqlangan turlar'
            : locale === 'ru'
              ? 'Сохранённые туры'
              : 'Saved Tours',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/saved`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? 'Saqlangan turlar — Sevimli sayohatlaringizni boshqaring'
      : locale === 'ru'
        ? 'Сохранённые туры — Управляйте своими любимыми путешествиями'
        : 'Saved Tours — Manage your favourite trips';

  const ariaLabels = {
    section:
      locale === 'uz'
        ? 'Saqlangan turlar ro‘yxati'
        : locale === 'ru'
          ? 'Список сохранённых туров'
          : 'Saved tours list',
  };

  return (
    <Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(savedSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <h1 className="sr-only">{h1Text}</h1>

        <section aria-label={ariaLabels.section}>
          <SavedClient />
        </section>
      </main>
    </Suspense>
  );
}
