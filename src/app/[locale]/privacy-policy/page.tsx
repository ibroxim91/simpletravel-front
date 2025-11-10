import { getHelpPage } from '@/features/privacy-policy/lib/api';
import HelpPage from '@/features/privacy-policy/ui/HelpPage';
import type { Metadata } from 'next';

// ✅ Har doim dinamik qilish
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Props = {
  params: { locale: string };
};

// 🌍 Tilga qarab fallback title/description
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

// ⚡ Dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;

  try {
    // ✅ cache: 'no-store' bilan fetch qilamiz
    const res = await getHelpPage({
      page_type: 'privacy_policy',
    });
    const page = res?.data?.data?.results?.[0];

    const fallback = getFallbackMeta(locale);

    const seo = {
      title: page?.title || fallback.title,
      description: page?.title || fallback.description,
    };

    return {
      title: seo.title,
      description: seo.description,
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/privacy-policy`,
        type: 'article',
        locale,
        siteName: 'Simple Travel',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-privacy-policy.jpg`,
            width: 1200,
            height: 630,
            alt: seo.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title,
        description: seo.description,
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-privacy-policy.jpg`],
      },
    };
  } catch {
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
