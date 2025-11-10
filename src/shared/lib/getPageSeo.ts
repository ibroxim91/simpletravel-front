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
  title: 'Simple Travel',
  description: 'Simple Travel',
  keywords: [
    'turlar',
    'sayohatlar',
    "ta'til",
    'issiq turlar',
    "mashhur yo'nalishlar",
  ],
  ogTitle: 'Simple Travel',
  ogDescription: 'Simple Travels',
  ogImage: '/Logo_blue.png',
};

export async function getPageSeo(locale: string = 'uz'): Promise<SeoData> {
  try {
    // ✅ Slug parametrini qo'shing
    const url = `${BASE_URL}/api/v1/dashboard/dashboard-site-seo/`;

    console.log("🔍 SEO API so'rovi:", url); // Debug uchun

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale,
      },
    });

    console.log('📊 Response status:', res.status); // Debug uchun

    if (!res.ok) {
      console.warn(`⚠️ SEO API xatolik: ${res.status}`);
      return DEFAULT_META;
    }

    const responseData = await res.json();
    console.log('📦 API javob:', responseData); // Debug uchun

    // ✅ Response strukturasini tekshiring
    const data =
      responseData.data?.results?.[0] || responseData.data || responseData;

    // ✅ Agar data bo'sh bo'lsa, default qaytarish
    if (!data || Object.keys(data).length === 0) {
      console.warn('⚠️ SEO data topilmadi, default ishlatilmoqda');
      return DEFAULT_META;
    }

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
    console.error("❌ SEO ma'lumotlarini yuklashda xatolik:", error);
    return DEFAULT_META;
  }
}
