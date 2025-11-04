import { getHelpPage } from '@/features/privacy-policy/lib/api';
import HelpPage from '@/features/privacy-policy/ui/HelpPage';
import type { Metadata } from 'next';

type Props = {
  params: { locale: string };
};

// Tilga qarab fallback title/description
const getFallbackMeta = (locale: string) => {
  switch (locale) {
    case 'uz':
      return {
        title: 'Maxfiylik siyosati | Simple Travel',
        description:
          'Simple Travel maxfiylik siyosati va foydalanuvchi ma’lumotlarini himoya qilish bo‘yicha to‘liq ma’lumot beradi.',
      };
    case 'ru':
      return {
        title: 'Политика конфиденциальности | Simple Travel',
        description:
          'Политика конфиденциальности Simple Travel и защита пользовательских данных.',
      };
    default:
      return {
        title: 'Privacy Policy | Simple Travel',
        description:
          'Simple Travel privacy policy and how we protect user information.',
      };
  }
};

// Dynamic SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;

  try {
    const res = await getHelpPage({ page_type: 'privacy_policy' });
    const page = res.data.data.results?.[0];

    const seo = {
      title: page?.title || getFallbackMeta(locale).title,
      description: page?.title || getFallbackMeta(locale).description,
    };

    return {
      title: seo.title,
      description: seo.description,
      openGraph: {
        title: seo.title,
        description: seo.description,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title,
        description: seo.description,
      },
    };
  } catch (error) {
    const fallback = getFallbackMeta(locale);
    return {
      title: fallback.title,
      description: fallback.description,
    };
  }
}

export default function PrivacyPolicyPage() {
  return <HelpPage type="privacy_policy" />;
}
