import { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from './LoginClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Kirish | Turlar sayti',
    ru: 'Вход | Сайт туров',
    en: 'Login | Tours Site',
  };

  const descriptions = {
    uz: 'Hisobingizga kiring va turlarni boshqaring. Shaxsiy kabinetga kirish.',
    ru: 'Войдите в свой аккаунт и управляйте турами. Вход в личный кабинет.',
    en: 'Log in to your account and manage tours. Access to personal account.',
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/login`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/login`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/login`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/login`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/login`,
      },
    },
  };
}

export default async function Login({ params }: Props) {
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
        name: locale === 'uz' ? 'Kirish' : locale === 'ru' ? 'Вход' : 'Login',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/login`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? 'Hisobga kirish'
      : locale === 'ru'
        ? 'Вход в систему'
        : 'Login to Account';

  return (
    <Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="h-[850px]">
        <h1 className="sr-only">{h1Text}</h1>
        <LoginClient />
      </main>
    </Suspense>
  );
}
