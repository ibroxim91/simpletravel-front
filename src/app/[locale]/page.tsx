import BannerCarousel from '@/features/home/ui/BannerCarousel';
import BannerCarouselMobile from '@/features/home/ui/BannerCarouselMobile';
import HotTours from '@/features/home/ui/HotTours';
import News from '@/features/home/ui/News';
import Populardestinations from '@/features/home/ui/Populardestinations';
import PopulardestinationsMboile from '@/features/home/ui/PopulardestinationsMboile';
import SearchTours from '@/features/home/ui/SearchTours';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Bosh sahifa | Eng yaxshi narxlarda turlar va sayohatlar',
    ru: 'Главная | Туры и путешествия по лучшим ценам',
    en: 'Home | Tours and Travel at the Best Prices',
  };

  const descriptions = {
    uz: "Ta'til uchun ideal turni toping. Issiq turlar, mashhur yo'nalishlar, turizm yangiliklari. Eng yaxshi takliflar bilan sayohatlarni onlayn bron qiling.",
    ru: 'Найдите идеальный тур для вашего отпуска. Горящие туры, популярные направления, новости туризма. Бронируйте путешествия онлайн с лучшими предложениями.',
    en: 'Find the perfect tour for your vacation. Hot tours, popular destinations, travel news. Book trips online with the best deals.',
  };

  const keywords = {
    uz: [
      'onlayn turlar',
      'issiq turlar',
      'sayohatlar',
      'chet elda dam olish',
      'turizm agentligi',
      'turlarni bron qilish',
      "mashhur yo'nalishlar",
      "ta'til",
    ],
    ru: [
      'туры онлайн',
      'горящие туры',
      'путешествия',
      'отдых за границей',
      'туристическое агентство',
      'бронирование туров',
      'популярные направления',
      'отпуск',
    ],
    en: [
      'online tours',
      'hot tours',
      'travel',
      'vacation abroad',
      'travel agency',
      'tour booking',
      'popular destinations',
      'vacation',
    ],
  };

  const ogTitles = {
    uz: 'Bosh sahifa | Eng yaxshi narxlarda turlar va sayohatlar',
    ru: 'Главная | Туры и путешествия по лучшим ценам',
    en: 'Home | Tours and Travel at the Best Prices',
  };

  const ogDescriptions = {
    uz: "Ta'til uchun ideal turni toping. Issiq turlar, mashhur yo'nalishlar, turizm yangiliklari.",
    ru: 'Найдите идеальный тур для вашего отпуска. Горящие туры, популярные направления, новости туризма.',
    en: 'Find the perfect tour for your vacation. Hot tours, popular destinations, travel news.',
  };

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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
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
              ? 'Turlar va sayohatlar'
              : locale === 'ru'
                ? 'Туры и путешествия'
                : 'Tours and Travel',
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
      },
    },
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  // Structured Data for WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name:
      locale === 'uz'
        ? 'Turlar sayti'
        : locale === 'ru'
          ? 'Сайт туров'
          : 'Tours Site',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name:
      locale === 'uz'
        ? 'Turlar sayti'
        : locale === 'ru'
          ? 'Сайт туров'
          : 'Tours Site',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/Logo_blue.png`,
    description:
      locale === 'uz'
        ? 'Professional turizm agentligi. Eng yaxshi turlar va xizmatlar.'
        : locale === 'ru'
          ? 'Профессиональное туристическое агентство. Лучшие туры и сервис.'
          : 'Professional travel agency. Best tours and service.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+998-XX-XXX-XX-XX',
      contactType: 'Customer Service',
      availableLanguage: ['Uzbek', 'Russian', 'English'],
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
    ],
  };

  const ariaLabels = {
    banner:
      locale === 'uz'
        ? 'Takliflar banneri'
        : locale === 'ru'
          ? 'Баннер с предложениями'
          : 'Offers Banner',
    search:
      locale === 'uz'
        ? 'Turlarni qidirish'
        : locale === 'ru'
          ? 'Поиск туров'
          : 'Search Tours',
    destinations:
      locale === 'uz'
        ? "Mashhur yo'nalishlar"
        : locale === 'ru'
          ? 'Популярные направления'
          : 'Popular Destinations',
    hotTours:
      locale === 'uz'
        ? 'Issiq turlar'
        : locale === 'ru'
          ? 'Горящие туры'
          : 'Hot Tours',
    news:
      locale === 'uz'
        ? 'Turizm yangiliklari'
        : locale === 'ru'
          ? 'Новости туризма'
          : 'Travel News',
  };

  const h1Text =
    locale === 'uz'
      ? 'Turlar va sayohatlar - Ideal dam olishni toping'
      : locale === 'ru'
        ? 'Туры и путешествия - Найдите идеальный отдых'
        : 'Tours and Travel - Find the Perfect Vacation';

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
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

        <div className="flex flex-col gap-10">
          {/* Hero Section with SEO-friendly headings */}
          <section aria-label={ariaLabels.banner}>
            <BannerCarousel />
            <BannerCarouselMobile />
          </section>

          {/* Search Section */}
          <section aria-label={ariaLabels.search}>
            <SearchTours />
          </section>

          {/* Main Content */}
          <div className="bg-white shadow-xl rounded-t-4xl p-4">
            {/* Popular Destinations Section */}
            <section aria-label={ariaLabels.destinations}>
              <Populardestinations />
              <PopulardestinationsMboile />
            </section>

            {/* Hot Tours Section */}
            <section aria-label={ariaLabels.hotTours}>
              <HotTours />
            </section>

            {/* News Section */}
            <section aria-label={ariaLabels.news}>
              <News />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
