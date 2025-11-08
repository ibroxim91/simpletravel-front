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

/**
 * SEO ma'lumotlarini API dan olish
 *
 * @param slug - Sahifa slug
 * @param locale - Til kodi (uz, ru, en)
 * @param revalidate - Ma'lumotlarni yangilash vaqti (soniyalarda)
 */
export async function getPageSeo(
  slug: string,
  locale: string = 'uz',
  revalidate: number = 3600, // 1 soat (o'zingizga moslang)
): Promise<SeoData> {
  try {
    const url = `${BASE_URL}/api/v1/dashboard/dashboard-site-seo/`;

    const res = await fetch(url, {
      // ✅ Statik export uchun cache strategiyasi
      next: {
        revalidate: revalidate, // ISR - har 1 soatda yangilanadi
      },
      // yoki to'liq statik qilish uchun:
      // cache: 'force-cache',

      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
    });

    if (!res.ok) {
      console.warn(`⚠️ SEO API error: ${res.status} ${res.statusText}`);
      return DEFAULT_META;
    }

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

/**
 * Agar to'liq statik export kerak bo'lsa (dynamic API so'rovlarsiz)
 * Build vaqtida SEO ma'lumotlarini olish
 */
export async function getStaticPageSeo(
  slug: string,
  locale: string = 'uz',
): Promise<SeoData> {
  try {
    const url = `${BASE_URL}/api/v1/dashboard/dashboard-site-seo/`;

    const res = await fetch(url, {
      cache: 'force-cache', // ✅ Build vaqtida bir marta olinadi
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
