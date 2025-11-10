// shared/lib/getPageSeo.ts
import { BASE_URL } from '../config/api/URLs';

export interface SeoData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

const DEFAULT_META: SeoData = {
  title: 'Sayohatlar va Turlar | Eng yaxshi narxlarda',
  description:
    "Ta'til uchun ideal turni toping. Issiq turlar, mashhur yo'nalishlar, turizm yangiliklari.",
  keywords: [
    'turlar',
    'sayohatlar',
    "ta'til",
    'issiq turlar',
    "mashhur yo'nalishlar",
  ],
  ogTitle: 'Sayohatlar va Turlar',
  ogDescription: 'Eng yaxshi turlar va sayohatlar',
  ogImage: '/Logo_blue.png',
};

export async function getPageSeo(
  slug: string,
  locale: string = 'uz',
): Promise<SeoData> {
  try {
    const url = `${BASE_URL}/api/v1/dashboard/dashboard-site-seo/`;

    const res = await fetch(url, {
      cache: 'no-store', // har safar serverdan oladi
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
    });

    if (!res.ok) return DEFAULT_META;

    const responseData = await res.json();
    const data = responseData.data?.results?.[0] || responseData;

    return {
      title: data?.title || DEFAULT_META.title,
      description: data?.description || DEFAULT_META.description,
      keywords: Array.isArray(data?.keywords)
        ? data.keywords
        : data?.keywords?.split(',').map((k: string) => k.trim()) ||
          DEFAULT_META.keywords,
      ogTitle: data?.og_title || data?.title || DEFAULT_META.ogTitle,
      ogDescription:
        data?.og_description || data?.description || DEFAULT_META.ogDescription,
      ogImage: data?.og_image || DEFAULT_META.ogImage,
    };
  } catch (error) {
    console.error('❌ Failed to fetch SEO data:', error);
    return DEFAULT_META;
  }
}
