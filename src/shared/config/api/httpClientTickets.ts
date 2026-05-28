import { BASE_URL_TICKETS } from './URLs'; // mikroservis URL
import { getLocale } from 'next-intl/server';
import { LanguageRoutes } from '../i18n/types';
import getLocaleCS from '@/shared/lib/getLocaleCS';
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getToken,
} from './saveToke';


const httpClientTickets = axios.create({
  baseURL: BASE_URL_TICKETS,
  timeout: 60000,
});

// Agar kerak bo‘lsa, interceptorlarni ham qo‘shish mumkin
httpClientTickets.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    let language = LanguageRoutes.UZ;
    try {
      language = (await getLocale()) as LanguageRoutes;
    } catch {
      language = getLocaleCS() || LanguageRoutes.UZ;
    }

    // ✅ headers.set orqali to‘g‘ri yozish
     const locale = localStorage.getItem('locale') || 'uz';
    config.headers.set('Accept-Language', locale);

    const accessToken = getToken();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

export default httpClientTickets;
