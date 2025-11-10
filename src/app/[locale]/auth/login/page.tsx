import { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from './LoginClient';
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Kirish | Turlar sayti',
    ru: 'Вход | Сайт туров',
    en: 'Login | Tours Site',
  };

  const descriptions = {
    uz: 'Hisobingizga kiring va turlarni boshqaring. Shaxsiy kabinetga kirish.',
    ru: 'Войдите в свой аккаунт и управляйте турами. Вход в личный кабинет.',
    en: 'Log in to your account and manage tours. Access to personal account.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
  };
}

export default async function Login() {
  return (
    <>
      <Suspense>
        <LoginClient />
      </Suspense>
    </>
  );
}
