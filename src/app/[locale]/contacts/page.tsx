import { Metadata } from 'next';
import { Suspense } from 'react';
import ContactClient from './contactClient';

const getMetadataByLocale = (locale: string) => {
  switch (locale) {
    case 'uz':
      return {
        title: 'Kontaktlar | Simple Travel',
        description:
          'Biz bilan bog‘laning — Simple Travel kompaniyasi sizga sayohatlar, turlar va xizmatlar haqida to‘liq ma’lumot beradi.',
      };
    case 'ru':
      return {
        title: 'Контакты | Simple Travel',
        description:
          'Свяжитесь с нами — компания Simple Travel предоставит полную информацию о турах, путешествиях и услугах.',
      };
    default:
      return {
        title: 'Contacts | Simple Travel',
        description:
          'Contact us — Simple Travel provides full information about tours, trips, and services.',
      };
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = getMetadataByLocale(locale);

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default function Page() {
  return (
    <>
      <div className="bg-[#EDEEF1] min-h-screen">
        <Suspense>
          <ContactClient />
        </Suspense>
      </div>
    </>
  );
}
