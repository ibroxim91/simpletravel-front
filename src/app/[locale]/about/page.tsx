import { Metadata } from 'next';
import { Suspense } from 'react';
import AboutClient from './AboutClient';
export const dynamic = 'force-dynamic';

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
  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
  };
}

const About = async () => {
  return (
    <>
      <Suspense>
        <AboutClient />
      </Suspense>
    </>
  );
};

export default About;
