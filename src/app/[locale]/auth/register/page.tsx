import { Metadata } from 'next';
import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: "Ro'yxatdan o'tish | Turlar sayti",
    ru: 'Регистрация | Сайт туров',
    en: 'Registration | Tours Site',
  };

  const descriptions = {
    uz: "Ro'yxatdan o'ting va eng yaxshi turlarni bron qiling. Shaxsiy kabinet orqali sayohatlaringizni boshqaring.",
    ru: 'Зарегистрируйтесь и бронируйте лучшие туры. Управляйте своими путешествиями через личный кабинет.',
    en: 'Register and book the best tours. Manage your trips through your personal account.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.uz,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.uz,
      type: 'website',
      locale: locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/register`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/register`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/register`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/register`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/register`,
      },
    },
  };
}

export default async function Register({ params }: Props) {
  const { locale } = await params;

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
            ? "Ro'yxatdan o'tish"
            : locale === 'ru'
              ? 'Регистрация'
              : 'Registration',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/register`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? "Ro'yxatdan o'tish"
      : locale === 'ru'
        ? 'Регистрация'
        : 'Registration';

  return (
    <Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="h-full">
        <h1 className="sr-only">{h1Text}</h1>
        <RegisterClient />
      </main>
    </Suspense>
  );
}
