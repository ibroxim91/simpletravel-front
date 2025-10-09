import { Metadata } from 'next';
import { Suspense } from 'react';
import EditPasswordClient from './EditPasswordClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: "Parolni o'zgartirish | Turlar sayti",
    ru: 'Изменить пароль | Сайт туров',
    en: 'Change Password | Tours Site',
  };

  const descriptions = {
    uz: "Hisobingiz xavfsizligini ta'minlash uchun parolni yangilang.",
    ru: 'Обновите пароль для обеспечения безопасности вашего аккаунта.',
    en: 'Update your password to ensure the security of your account.',
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/edit-password`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/edit-password`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/edit-password`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/edit-password`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/edit-password`,
      },
    },
  };
}

export default async function EditPassword({ params }: Props) {
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
            ? "Parolni o'zgartirish"
            : locale === 'ru'
              ? 'Изменить пароль'
              : 'Change Password',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/edit-password`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? "Parolni o'zgartirish"
      : locale === 'ru'
        ? 'Изменить пароль'
        : 'Change Password';

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
        <EditPasswordClient />
      </main>
    </Suspense>
  );
}
