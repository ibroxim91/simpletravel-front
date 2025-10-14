import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileClient from './profileClient';

type Props = {
  params: Promise<{ locale: string }>;
};

// 🧠 SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Profil | Shaxsiy ma’lumotlar va buyurtmalar',
    ru: 'Профиль | Личные данные и заказы',
    en: 'Profile | Personal Information and Orders',
  };

  const descriptions = {
    uz: 'Shaxsiy profilingizni boshqaring: buyurtmalar, saqlangan turlar, hisob sozlamalari va boshqalar.',
    ru: 'Управляйте своим профилем: заказы, сохранённые туры, настройки аккаунта и многое другое.',
    en: 'Manage your profile: orders, saved tours, account settings, and more.',
  };

  const keywords = {
    uz: [
      'profil',
      'shaxsiy kabinet',
      'buyurtmalar',
      'turlar',
      'hisob sozlamalari',
      'sayohat profili',
      'turizm akkaunti',
    ],
    ru: [
      'профиль',
      'личный кабинет',
      'заказы',
      'туры',
      'настройки аккаунта',
      'туризм профиль',
    ],
    en: [
      'profile',
      'account',
      'orders',
      'tours',
      'account settings',
      'travel profile',
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/profile`,
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
              ? 'Foydalanuvchi profili'
              : locale === 'ru'
                ? 'Профиль пользователя'
                : 'User Profile',
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/profile`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/profile`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/profile`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/profile`,
      },
    },
  };
}

const Profile = () => {
  const locale =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/')[1] || 'uz'
      : 'uz';

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
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description:
      locale === 'uz'
        ? 'Professional turizm agentligi. Eng yaxshi turlar va xizmatlar.'
        : locale === 'ru'
          ? 'Профессиональное туристическое агентство. Лучшие туры и сервис.'
          : 'Professional travel agency. Best tours and service.',
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
          locale === 'uz' ? 'Profil' : locale === 'ru' ? 'Профиль' : 'Profile',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/profile`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? 'Foydalanuvchi profili'
      : locale === 'ru'
        ? 'Профиль пользователя'
        : 'User Profile';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <h1 className="sr-only">{h1Text}</h1>
        <ProfileClient />
      </main>
    </Suspense>
  );
};

export default Profile;
