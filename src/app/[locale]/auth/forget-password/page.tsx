import { Metadata } from 'next';
import { Suspense } from 'react';
import ForgetPasswordClient from './ForgetPasswordClient';
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: 'Parolni tiklash | Turlar sayti',
    ru: 'Восстановление пароля | Сайт туров',
    en: 'Password Recovery | Tours Site',
  };

  const descriptions = {
    uz: 'Parolni unutdingizmi? Elektron pochta orqali parolni tiklang.',
    ru: 'Забыли пароль? Восстановите пароль через электронную почту.',
    en: 'Forgot your password? Recover your password via email.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
  };
}

export default async function ForgetPassword() {
  return (
    <>
      <Suspense>
        <ForgetPasswordClient />
      </Suspense>
    </>
  );
}
