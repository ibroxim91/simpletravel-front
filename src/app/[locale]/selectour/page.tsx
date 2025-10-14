import type { Metadata } from 'next';
import { Suspense } from 'react';
import SelectourClient from './selectourClient';

type Props = {
  params: Promise<{ locale: string }>;
};

// 🧠 SEO metadata (tilga qarab)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Tur tanlash | Eng yaxshi yo‘nalishlar va narxlar',
    ru: 'Выбор тура | Лучшие направления и цены',
    en: 'Select Tour | Best Destinations and Prices',
  };

  const descriptions = {
    uz: "O'zingizga mos sayohatni tanlang — mamlakat, muddat va byudjet bo‘yicha filtrlang. Eng yaxshi turlarni toping va hoziroq bron qiling.",
    ru: 'Выберите тур по стране, срокам и бюджету. Найдите лучшие предложения и бронируйте онлайн прямо сейчас.',
    en: 'Choose your ideal tour by country, duration, and budget. Find the best offers and book online now.',
  };

  const keywords = {
    uz: [
      'tur tanlash',
      'sayohat turlari',
      'mashhur yo‘nalishlar',
      'online bron qilish',
      'eng yaxshi turlar',
      'sayohat agentligi',
    ],
    ru: [
      'выбор тура',
      'популярные направления',
      'бронирование туров онлайн',
      'туристическое агентство',
      'лучшие туры',
    ],
    en: [
      'select tour',
      'best travel destinations',
      'book tours online',
      'travel agency',
      'vacation offers',
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
      locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/selectour`,
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
              ? 'Tur tanlash sahifasi'
              : locale === 'ru'
                ? 'Страница выбора тура'
                : 'Select Tour Page',
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/selectour`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/selectour`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/selectour`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/selectour`,
      },
    },
  };
}

// 📘 Page Component
export default async function Page({ params }: Props) {
  const { locale } = await params;

  // ✅ Structured Data: Select Tour Page
  const selectourSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name:
      locale === 'uz'
        ? 'Tur tanlash'
        : locale === 'ru'
          ? 'Выбор тура'
          : 'Select Tour',
    description:
      locale === 'uz'
        ? "O'zingiz uchun eng mos turni tanlang va online bron qiling."
        : locale === 'ru'
          ? 'Выберите подходящий тур и бронируйте онлайн.'
          : 'Select your perfect tour and book online.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/selectour`,
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
            ? 'Tur tanlash'
            : locale === 'ru'
              ? 'Выбор тура'
              : 'Select Tour',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/selectour`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? "Tur tanlash — O'zingizga mos sayohatni toping"
      : locale === 'ru'
        ? 'Выбор тура — Найдите подходящее путешествие'
        : 'Select Tour — Find the Right Trip for You';

  const ariaLabels = {
    section:
      locale === 'uz'
        ? 'Tur tanlash bo‘limi'
        : locale === 'ru'
          ? 'Раздел выбора тура'
          : 'Tour selection section',
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* 🧩 Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(selectourSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <h1 className="sr-only">{h1Text}</h1>

        <section aria-label={ariaLabels.section}>
          <SelectourClient />
        </section>
      </main>
    </Suspense>
  );
}
