import { Metadata } from 'next';
import { Suspense } from 'react';
import FaqClient from './faqClient';
export const dynamic = 'force-dynamic';

const getMetadataByLocale = (locale: string) => {
  switch (locale) {
    case 'uz':
      return {
        title: 'Ko‘p so‘raladigan savollar | Simple Travel',
        description:
          'Sayohat, tur paketlari va xizmatlar bo‘yicha tez-tez beriladigan savollar va ularning javoblari. Simple Travel siz uchun eng muhim savollarga javob beradi.',
      };
    case 'ru':
      return {
        title: 'Часто задаваемые вопросы | Simple Travel',
        description:
          'Ответы на часто задаваемые вопросы о турах, путешествиях и услугах компании Simple Travel. Мы собрали всё самое важное для вас.',
      };
    default:
      return {
        title: 'Frequently Asked Questions | Simple Travel',
        description:
          'Find answers to frequently asked questions about tours, travel packages, and services. Simple Travel provides helpful information for travelers.',
      };
  }
};

export async function generateMetadata({params,}: {params: Promise<{ locale: string }>;}): Promise<Metadata> {
  const { locale } = await params;
  const meta = getMetadataByLocale(locale);

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default function Faq() {
  return (
    <>
      <Suspense>
        <FaqClient />
      </Suspense>
    </>
  );
}
