import { Metadata } from 'next';
import { Suspense } from 'react';
import AboutClient from './AboutClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Biz haqimizda | Sayohat kompaniyasi',
    ru: 'О нас | Туристическая компания',
    en: 'About Us | Travel Company',
  };

  const descriptions = {
    uz: "Bizning kompaniya haqida batafsil ma'lumot. Hamkorlarimiz, sertifikatlarimiz va xizmatlarimiz. Professional sayohat agentligi.",
    ru: 'Подробная информация о нашей туристической компании. Наши партнеры, сертификаты и услуги. Профессиональное туристическое агентство.',
    en: 'Detailed information about our travel company. Our partners, certificates and services. Professional travel agency.',
  };

  const keywords = {
    uz: [
      'sayohat kompaniyasi',
      'turlar',
      'hamkorlar',
      'sertifikatlar',
      'turizm agentligi',
      'biz haqimizda',
      'professional xizmat',
    ],
    ru: [
      'туристическая компания',
      'туры',
      'партнеры',
      'сертификаты',
      'турагентство',
      'о нас',
      'профессиональный сервис',
    ],
    en: [
      'travel company',
      'tours',
      'partners',
      'certificates',
      'travel agency',
      'about us',
      'professional service',
    ],
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
    keywords: keywords[locale as keyof typeof keywords] || keywords.uz,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.uz,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.uz,
      type: 'website',
      locale: locale,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/about`,
      siteName: 'Ваш сайт туров',
      images: [
        {
          url: '/Logo_blue.png',
          width: 1200,
          height: 630,
          alt: titles[locale as keyof typeof titles] || titles.uz,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.uz,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.uz,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/about`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/about`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/about`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/about`,
      },
    },
  };
}

const About = async ({ params }: Props) => {
  const { locale } = await params;

  // Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Ваш сайт туров',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description:
      locale === 'uz'
        ? 'Professional sayohat agentligi. Eng yaxshi turlar va xizmatlar.'
        : locale === 'ru'
          ? 'Профессиональное туристическое агентство. Лучшие туры и сервис.'
          : 'Professional travel agency. Best tours and service.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tashkent',
      addressCountry: 'UZ',
    },
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
      {
        '@type': 'ListItem',
        position: 2,
        name:
          locale === 'uz'
            ? 'Biz haqimizda'
            : locale === 'ru'
              ? 'О нас'
              : 'About Us',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/about`,
      },
    ],
  };

  // Structured Data for AboutPage
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'TravelAgency',
      name: 'Ваш сайт туров',
      description:
        locale === 'uz'
          ? "Bizning kompaniya sayohat sohasida ko'p yillik tajribaga ega professional agentlikdir."
          : locale === 'ru'
            ? 'Наша компания - профессиональное туристическое агентство с многолетним опытом в сфере туризма.'
            : 'Our company is a professional travel agency with many years of experience in tourism.',
    },
  };

  return (
    <>
      {/* Structured Data */}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema),
        }}
      />

      {/* Main Content */}
      <main>
        <h1 className="sr-only">
          {locale === 'uz'
            ? 'Biz haqimizda - Professional sayohat kompaniyasi'
            : locale === 'ru'
              ? 'О нас - Профессиональная туристическая компания'
              : 'About Us - Professional Travel Company'}
        </h1>

        <article
          aria-label={
            locale === 'uz'
              ? "Kompaniya haqida ma'lumot"
              : locale === 'ru'
                ? 'Информация о компании'
                : 'Company Information'
          }
        >
          <Suspense>
            <AboutClient />
          </Suspense>
        </article>
      </main>
    </>
  );
};

export default About;
