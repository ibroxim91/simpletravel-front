import DeleteAccountClient from './DeleteAccountClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: "Akkauntni o'chirish | Simple Travel",
    ru: 'Удаление аккаунта | Simple Travel',
  };

  const descriptions = {
    uz: "Simple Travel akkauntingizni o'chirish bo'yicha ko'rsatmalar va so'rov.",
    ru: 'Инструкции и запрос на удаление аккаунта Simple Travel.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
  };
}

export default async function DeleteAccountPage() {
  return <DeleteAccountClient />;
}
