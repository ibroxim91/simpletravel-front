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
  };
}

export default async function EditPassword() {
  return (
    <>
      <Suspense>
        <EditPasswordClient />
      </Suspense>
    </>
  );
}
