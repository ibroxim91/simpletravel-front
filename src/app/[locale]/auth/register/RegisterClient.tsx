import Auth from '@/features/auth/ui/auth';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const titles = {
    uz: "Ro'yxatdan o'tish | Turlar sayti",
    ru: 'Регистрация | Сайт туров',
    en: 'Registration | Tours Site',
  };

  const descriptions = {
    uz: "Ro'yxatdan o'ting va eng yaxshi turlarni bron qiling. Shaxsiy kabinet orqali sayohatlaringizni boshqaring.",
    ru: 'Зарегистрируйтесь и бронируйте лучшие туры. Управляйте своими путешествиями через личный кабинет.',
    en: 'Register and book the best tours. Manage your trips through your personal account.',
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.uz,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.uz,
  };
}

const RegisterClient = () => {
  const t = useTranslations();
  return (
    <div className="h-full">
      <Auth />
      <div className="absolute max-lg:bottom-20 lg:bottom-5 w-full flex justify-center text-[#212122]">
        <p>{t('2025 © Все права защищены')}</p>
      </div>
    </div>
  );
};

export default RegisterClient;
