import { Metadata } from 'next';
import { Suspense } from 'react';
import ForgetPasswordClient from './ForgetPasswordClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Parolni tiklash | Turlar sayti',
    ru: 'Восстановление пароля | Сайт туров',
    en: 'Password Recovery | Tours Site',
  };

  const descriptions = {
    uz: 'Parolni unutdingizmi? Elektron pochta orqali parolni tiklang.',
    ru: 'Забыли пароль? Восстановите пароль через электронную почту.',
    en: 'Forgot your password? Recover your password via email.',
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/forget-password`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/forget-password`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/forget-password`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/forget-password`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/forget-password`,
      },
    },
  };
}

export default async function ForgetPassword({ params }: Props) {
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
            ? 'Parolni tiklash'
            : locale === 'ru'
              ? 'Восстановление пароля'
              : 'Password Recovery',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/forget-password`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? 'Parolni tiklash'
      : locale === 'ru'
        ? 'Восстановление пароля'
        : 'Password Recovery';

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
        <ForgetPasswordClient />
      </main>
    </Suspense>
  );
}
