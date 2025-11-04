import { Metadata } from 'next';
import { Suspense } from 'react';
import BlogsClient from './BlogsClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Blog va Yangiliklar | Sayohat va Turizm',
    ru: 'Блог и Новости | Путешествия и Туризм',
    en: 'Blog and News | Travel and Tourism',
  };

  const descriptions = {
    uz: "Sayohat va turizm haqida so'ngi yangiliklar, foydali maslahatlar, sayohat tajribalari va turlar haqida maqolalar.",
    ru: 'Последние новости о путешествиях и туризме, полезные советы, опыт путешествий и статьи о турах.',
    en: 'Latest travel and tourism news, useful tips, travel experiences and articles about tours.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
  };
}

export default async function Blogs() {
  return (
    <>
      <Suspense>
        <BlogsClient />
      </Suspense>
    </>
  );
}
