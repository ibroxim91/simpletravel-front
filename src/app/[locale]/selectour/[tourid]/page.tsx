import { TicketsDetailAPi } from '@/widgets/singletour/lib/api';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import SingleTourClient from './singleTourClient';

// 🧠 SEO metadata
type Props = {
  params: Promise<{ locale: string; tourid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tourid } = await params;

  try {
    // 🎯 API orqali tur ma’lumotini olish
    const res = await TicketsDetailAPi.getTicketsDetail({ id: Number(tourid) });
    const tour = res?.data?.data;

    const siteName =
      locale === 'uz'
        ? 'Turlar sayti'
        : locale === 'ru'
          ? 'Сайт туров'
          : 'Tours Site';

    const title = tour?.title || 'Tur tafsilotlari';
    const description =
      locale === 'uz'
        ? `${tour?.departure}dan ${tour?.destination}ga ${tour?.duration_days} kunlik safar. Narxi: ${tour?.price} so'mdan.`
        : locale === 'ru'
          ? `Путешествие из ${tour?.departure} в ${tour?.destination}. ${tour?.duration_days} дней. Цена от ${tour?.price} сум.`
          : `Trip from ${tour?.departure} to ${tour?.destination}. ${tour?.duration_days} days. Price from ${tour?.price} UZS.`;

    const image = tour?.ticket_images?.[0]?.image
      ? `${process.env.NEXT_PUBLIC_API_URL}${tour.ticket_images[0].image}`
      : '/Logo_blue.png';

    return {
      title: `${title} | ${siteName}`,
      description,
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/tickets/${tourid}`,
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
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/tickets/${tourid}`,
        languages: {
          uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/tickets/${tourid}`,
          ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/tickets/${tourid}`,
          en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/tickets/${tourid}`,
        },
      },
    };
  } catch {
    return {
      title: 'Tur tafsilotlari | Turlar sayti',
      description: 'Eng yaxshi turlar va sayohatlar haqida batafsil ma’lumot.',
    };
  }
}

export default async function SingleTourPage({ params }: Props) {
  const { locale, tourid } = await params;

  // 🎯 API orqali JSON-LD uchun ma’lumot olish
  const res = await TicketsDetailAPi.getTicketsDetail({ id: Number(tourid) });
  const tour = res?.data?.data;

  const siteName =
    locale === 'uz'
      ? 'Turlar sayti'
      : locale === 'ru'
        ? 'Сайт туров'
        : 'Tours Site';

  const title = tour?.title || 'Tur tafsilotlari';
  const description =
    locale === 'uz'
      ? `${tour?.departure}dan ${tour?.destination}ga ${tour?.duration_days} kunlik safar. Narxi: ${tour?.price} so'mdan.`
      : locale === 'ru'
        ? `Путешествие из ${tour?.departure} в ${tour?.destination}. ${tour?.duration_days} дней. Цена от ${tour?.price} сум.`
        : `Trip from ${tour?.departure} to ${tour?.destination}. ${tour?.duration_days} days. Price from ${tour?.price} UZS.`;

  const image = tour?.ticket_images?.[0]?.image
    ? `${process.env.NEXT_PUBLIC_API_URL}${tour.ticket_images[0].image}`
    : '/Logo_blue.png';

  const datePublished = new Date().toISOString();

  // 🧾 JSON-LD Structured Data
  const touristTripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: title,
    description,
    image,
    offers: {
      '@type': 'Offer',
      price: tour?.price,
      priceCurrency: 'UZS',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/tickets/${tourid}`,
    },
    itinerary: tour?.ticket_itinerary?.map((item) => ({
      '@type': 'TouristAttraction',
      name: item?.title,
      description: `${item?.duration} soatlik manzillar`,
      image:
        item?.ticket_itinerary_image?.[0]?.image &&
        `${process.env.NEXT_PUBLIC_API_URL}${item.ticket_itinerary_image[0].image}`,
    })),
    organizer: {
      '@type': 'Organization',
      name: siteName,
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    inLanguage: locale,
    datePublished,
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
        name: locale === 'uz' ? 'Turlar' : locale === 'ru' ? 'Туры' : 'Tours',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/tickets`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/tickets/${tourid}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([touristTripSchema, breadcrumbSchema]),
        }}
      />

      <main>
        <h1 className="sr-only">{title}</h1>
        <Suspense>
          <SingleTourClient />
        </Suspense>
      </main>
    </>
  );
}
