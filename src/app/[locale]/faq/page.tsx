import type { Metadata } from 'next';
import { Suspense } from 'react';
import FaqClient from './faqClient';

type Props = {
  params: Promise<{ locale: string }>;
};

// 🧠 SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Ko‘p beriladigan savollar | Sayohat kompaniyasi',
    ru: 'Часто задаваемые вопросы | Туристическая компания',
    en: 'Frequently Asked Questions | Travel Company',
  };

  const descriptions = {
    uz: 'Sayohatlar, to‘lovlar, hujjatlar va xizmatlar bo‘yicha eng ko‘p beriladigan savollarga javoblar.',
    ru: 'Ответы на часто задаваемые вопросы о путешествиях, оплате, документах и наших услугах.',
    en: 'Answers to the most frequently asked questions about travel, payments, documents, and our services.',
  };

  const keywords = {
    uz: [
      'FAQ',
      'savollar va javoblar',
      'sayohat savollari',
      'turizm ma’lumotlari',
      'sayohat agentligi',
      'turlar haqida ma’lumot',
    ],
    ru: [
      'FAQ',
      'вопросы и ответы',
      'вопросы о путешествиях',
      'информация о туризме',
      'туристическое агентство',
      'информация о турах',
    ],
    en: [
      'FAQ',
      'questions and answers',
      'travel questions',
      'tourism information',
      'travel agency',
      'tour details',
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
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/faq`,
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
              ? 'Ko‘p beriladigan savollar'
              : locale === 'ru'
                ? 'Часто задаваемые вопросы'
                : 'Frequently Asked Questions',
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/faq`,
      languages: {
        uz: `${process.env.NEXT_PUBLIC_SITE_URL}/uz/faq`,
        ru: `${process.env.NEXT_PUBLIC_SITE_URL}/ru/faq`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/faq`,
      },
    },
  };
}

export default async function Faq({ params }: Props) {
  const { locale } = await params;

  // 📊 Structured Data: FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name:
          locale === 'uz'
            ? 'Turlarni qanday bron qilish mumkin?'
            : locale === 'ru'
              ? 'Как забронировать тур?'
              : 'How can I book a tour?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            locale === 'uz'
              ? 'Siz veb-sayt orqali onlayn tarzda tur tanlab, to‘lovni amalga oshirishingiz mumkin.'
              : locale === 'ru'
                ? 'Вы можете выбрать тур и оплатить его онлайн через наш сайт.'
                : 'You can choose and pay for your tour online via our website.',
        },
      },
      {
        '@type': 'Question',
        name:
          locale === 'uz'
            ? 'To‘lov usullari qanday?'
            : locale === 'ru'
              ? 'Какие способы оплаты доступны?'
              : 'What payment methods are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            locale === 'uz'
              ? 'Biz karta orqali, bank orqali va naqd to‘lovni qabul qilamiz.'
              : locale === 'ru'
                ? 'Мы принимаем оплату картой, банковским переводом и наличными.'
                : 'We accept payment by card, bank transfer, and cash.',
        },
      },
    ],
  };

  // 🏢 Organization Schema
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

  // 🧭 Breadcrumb Schema
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
            ? 'Ko‘p beriladigan savollar'
            : locale === 'ru'
              ? 'Часто задаваемые вопросы'
              : 'Frequently Asked Questions',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/faq`,
      },
    ],
  };

  const h1Text =
    locale === 'uz'
      ? 'Ko‘p beriladigan savollar'
      : locale === 'ru'
        ? 'Часто задаваемые вопросы'
        : 'Frequently Asked Questions';

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
        <Suspense>
          <FaqClient />
        </Suspense>
      </main>
    </>
  );
}
