import { Metadata } from 'next';
import BookingClient from './BookingClient';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

// 🧠 SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  // Client-side da ma'lumot yuklanadi, shuning uchun default metadata beramiz
  const siteName =
    locale === 'uz'
      ? 'Turlar sayti'
      : locale === 'ru'
        ? 'Сайт туров'
        : 'Tours Site';

  const title =
    locale === 'uz'
      ? 'Bron qilish'
      : locale === 'ru'
        ? 'Забронировать'
        : 'Booking';

  const description =
    locale === 'uz'
      ? 'Sayohat va turlarni bron qilish - ajoyib takliflar va qulay narxlar'
      : locale === 'ru'
        ? 'Бронирование туров и путешествий - выгодные предложения и удобные цены'
        : 'Book tours and travels - great offers and convenient prices';

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/booking/${id}`,
      type: 'website',
      locale,
      siteName,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-booking.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-booking.jpg`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/booking/${id}`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/booking/${id}`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/booking/${id}`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/booking/${id}`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BookingPage({ params }: Props) {
  const { locale, id } = await params;

  const title =
    locale === 'uz'
      ? 'Bron qilish'
      : locale === 'ru'
        ? 'Забронировать'
        : 'Booking';

  const description =
    locale === 'uz'
      ? 'Sayohat va turlarni bron qilish - ajoyib takliflar va qulay narxlar'
      : locale === 'ru'
        ? 'Бронирование туров и путешествий - выгодные предложения и удобные цены'
        : 'Book tours and travels - great offers and convenient prices';

  // Service Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Tour Booking',
    name: title,
    description,
    provider: {
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
    areaServed: {
      '@type': 'Country',
      name: 'Uzbekistan',
    },
  };

  // Breadcrumb Schema
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
            ? 'Turni tanlash'
            : locale === 'ru'
              ? 'Подобрать тур'
              : 'Select Tour',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/selectour`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name:
          locale === 'uz'
            ? 'Bron qilish'
            : locale === 'ru'
              ? 'Забронировать'
              : 'Booking',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/booking/${id}`,
      },
    ],
  };

  // WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/booking/${id}`,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name:
        locale === 'uz'
          ? 'Turlar sayti'
          : locale === 'ru'
            ? 'Сайт туров'
            : 'Tours Site',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            serviceSchema,
            breadcrumbSchema,
            webPageSchema,
          ]),
        }}
      />

      <main>
        <h1 className="sr-only">{title}</h1>
        <BookingClient />
      </main>
    </>
  );
}
