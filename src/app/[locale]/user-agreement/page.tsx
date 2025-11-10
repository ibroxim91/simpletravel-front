import { getHelpPage } from '@/features/privacy-policy/lib/api';
import HelpPage from '@/features/privacy-policy/ui/HelpPage';
import { Metadata } from 'next';

// Har doim dinamik qilish
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

type Props = {
  params: { locale: string };
};

// Tilga qarab fallback title/description
const getFallbackMeta = (locale: string) => {
  switch (locale) {
    case 'uz':
      return {
        title: 'Foydalanuvchi kelishuvi | Simple Travel',
        description:
          'Simple Travel foydalanuvchi kelishuvi va shartlari bo‘yicha to‘liq ma’lumot beradi.',
      };
    case 'ru':
      return {
        title: 'Пользовательское соглашение | Simple Travel',
        description:
          'Пользовательское соглашение Simple Travel и правила использования.',
      };
    default:
      return {
        title: 'User Agreement | Simple Travel',
        description: 'Simple Travel user agreement and usage terms.',
      };
  }
};

// Dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const fallback = getFallbackMeta(locale);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://simple-travel-blond.vercel.app';

  try {
    // Har safar yangi ma'lumot olish
    const res = await getHelpPage({ page_type: 'user_agreement' });
    const page = res?.data?.data?.results?.[0];

    const seo = {
      title: page?.title || fallback.title,
      description: page?.title || fallback.description,
      canonical: `${siteUrl}/${locale}/user-agreement`,
      ogImage: `${siteUrl}/og-user-agreement.jpg`,
    };

    return {
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: seo.canonical,
      },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: seo.canonical,
        type: 'article',
        locale,
        siteName: 'Simple Travel',
        images: [
          {
            url: seo.ogImage,
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
        images: [seo.ogImage],
      },
    };
  } catch (error) {
    console.error('generateMetadata user-agreement error:', error);
    return {
      title: fallback.title,
      description: fallback.description,
    };
  }
}

const UserAgreement = () => {
  return <HelpPage type="user_agreement" />;
};

export default UserAgreement;
