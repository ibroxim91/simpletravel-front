import type { Metadata } from 'next';

const translations = {
  ru: {
    siteName: 'Туры и путешествия',
    titleTemplate: '%s | Туры и путешествия',
    defaultTitle: 'Главная | Туры и путешествия по лучшим ценам',
    description:
      'Найдите идеальный тур для вашего отпуска. Горящие туры, популярные направления, новости туризма.',
    keywords: [
      'туры онлайн',
      'горящие туры',
      'путешествия',
      'отдых за границей',
      'туристическое агентство',
      'бронирование туров',
    ],
    locale: 'ru_RU',
  },
  uz: {
    siteName: 'Turlar va sayohatlar',
    titleTemplate: '%s | Turlar va sayohatlar',
    defaultTitle: 'Bosh sahifa | Eng yaxshi narxlardagi turlar',
    description:
      "Ta'tilingiz uchun ideal turni toping. Issiq turlar, mashhur yo'nalishlar, turizm yangiliklari.",
    keywords: [
      'onlayn turlar',
      'issiq turlar',
      'sayohatlar',
      'chet elda dam olish',
      'turagentlik',
      'turlarni bron qilish',
    ],
    locale: 'uz_UZ',
  },
  en: {
    siteName: 'Tours and Travel',
    titleTemplate: '%s | Tours and Travel',
    defaultTitle: 'Home | Tours and Travel at Best Prices',
    description:
      'Find the perfect tour for your vacation. Hot tours, popular destinations, and tourism news.',
    keywords: [
      'online tours',
      'hot tours',
      'travel',
      'vacation abroad',
      'travel agency',
      'tour booking',
    ],
    locale: 'en_US',
  },
};

export const getSeoMetadata = (
  locale: string,
  pageTitle?: string,
  pageDescription?: string,
  pagePath: string = '/',
): Metadata => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
  const t =
    translations[locale as keyof typeof translations] || translations.ru;
  const fullTitle = pageTitle
    ? t.titleTemplate.replace('%s', pageTitle)
    : t.defaultTitle;

  return {
    title: fullTitle,
    description: pageDescription || t.description,
    keywords: t.keywords,
    openGraph: {
      title: fullTitle,
      description: pageDescription || t.description,
      type: 'website',
      locale: t.locale,
      url: `${baseUrl}/${locale}${pagePath}`,
      siteName: t.siteName,
      images: [
        {
          url: `${baseUrl}/og-${pagePath.replace('/', '') || 'home'}-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: t.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: pageDescription || t.description,
      images: [
        `${baseUrl}/og-${pagePath.replace('/', '') || 'home'}-${locale}.jpg`,
      ],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}${pagePath}`,
      languages: {
        'ru-RU': `${baseUrl}/ru${pagePath}`,
        'uz-UZ': `${baseUrl}/uz${pagePath}`,
        'en-US': `${baseUrl}/en${pagePath}`,
        'x-default': `${baseUrl}/ru${pagePath}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  };
};
