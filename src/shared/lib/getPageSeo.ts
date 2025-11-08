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
 * SEO ma'lumotlarini API dan olish (umumiy sahifalar uchun)
 *
 * @param slug - Sahifa slug
 * @param locale - Til kodi (uz, ru, en)
 * @param revalidate - Ma'lumotlarni yangilash vaqti (soniyalarda)
 */
export async function getPageSeo(
  slug: string,
  locale: string = 'uz',
  revalidate: number = 3600,
): Promise<SeoData> {
  try {
    const url = `${BASE_URL}/api/v1/dashboard/dashboard-site-seo/`;

    const res = await fetch(url, {
      next: {
        revalidate: revalidate,
      },
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
 * Dynamic sahifalar uchun SEO ma'lumotlarini olish (masalan: tur detali, blog post)
 *
 * @param endpoint - API endpoint (masalan: '/tours/', '/blogs/')
 * @param id - Sahifa ID yoki slug
 * @param locale - Til kodi
 * @param revalidate - Yangilash vaqti
 */
export async function getDynamicPageSeo(
  endpoint: string,
  id: string | number,
  locale: string = 'uz',
  revalidate: number = 3600,
): Promise<SeoData> {
  try {
    const url = `${BASE_URL}${endpoint}${id}/`;

    const res = await fetch(url, {
      next: {
        revalidate: revalidate,
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
    });

    if (!res.ok) {
      return DEFAULT_META;
    }

    const data = await res.json();

    return {
      title: data?.seo_title || data?.title || data?.name || DEFAULT_META.title,
      description:
        data?.seo_description || data?.description || DEFAULT_META.description,
      keywords: Array.isArray(data?.seo_keywords)
        ? data.seo_keywords
        : data?.seo_keywords?.split(',').map((k: string) => k.trim()) ||
          data?.keywords?.split(',').map((k: string) => k.trim()) ||
          DEFAULT_META.keywords,
      ogTitle:
        data?.og_title ||
        data?.seo_title ||
        data?.title ||
        DEFAULT_META.ogTitle,
      ogDescription:
        data?.og_description ||
        data?.seo_description ||
        data?.description ||
        DEFAULT_META.ogDescription,
      ogImage:
        data?.og_image ||
        data?.image ||
        data?.thumbnail ||
        DEFAULT_META.ogImage,
    };
  } catch (error) {
    return DEFAULT_META;
  }
}

/**
 * To'liq statik export uchun (build vaqtida)
 */
export async function getStaticPageSeo(
  slug: string,
  locale: string = 'uz',
): Promise<SeoData> {
  try {
    const url = `${BASE_URL}/api/v1/dashboard/dashboard-site-seo/`;

    const res = await fetch(url, {
      cache: 'force-cache',
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
    return DEFAULT_META;
  }
}

/**
 * Dynamic sahifalar uchun statik SEO (build vaqtida)
 */
export async function getStaticDynamicPageSeo(
  endpoint: string,
  id: string | number,
  locale: string = 'uz',
): Promise<SeoData> {
  try {
    const url = `${BASE_URL}${endpoint}${id}/`;

    const res = await fetch(url, {
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
    });

    if (!res.ok) return DEFAULT_META;

    const data = await res.json();

    return {
      title: data?.seo_title || data?.title || data?.name || DEFAULT_META.title,
      description:
        data?.seo_description || data?.description || DEFAULT_META.description,
      keywords: Array.isArray(data?.seo_keywords)
        ? data.seo_keywords
        : data?.seo_keywords?.split(',').map((k: string) => k.trim()) ||
          data?.keywords?.split(',').map((k: string) => k.trim()) ||
          DEFAULT_META.keywords,
      ogTitle:
        data?.og_title ||
        data?.seo_title ||
        data?.title ||
        DEFAULT_META.ogTitle,
      ogDescription:
        data?.og_description ||
        data?.seo_description ||
        data?.description ||
        DEFAULT_META.ogDescription,
      ogImage:
        data?.og_image ||
        data?.image ||
        data?.thumbnail ||
        DEFAULT_META.ogImage,
    };
  } catch (error) {
    console.error('❌ Failed to fetch static dynamic SEO data:', error);
    return DEFAULT_META;
  }
}
