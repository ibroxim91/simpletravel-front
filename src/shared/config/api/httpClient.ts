import getLocaleCS from '@/shared/lib/getLocaleCS';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getLocale } from 'next-intl/server';
import { LanguageRoutes } from '../i18n/types';
import { BASE_URL } from './URLs';
import {
  getRefToken,
  getToken,
  removeRefToken,
  removeToken,
  saveToken,
} from './saveToke';

const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// ✅ REQUEST INTERCEPTOR — to‘liq to‘g‘rilangan
httpClient.interceptors.request.use(
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
    config.headers.set('Accept-Language', language);

    const accessToken = getToken();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ✅ RESPONSE INTERCEPTOR
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<never> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/v1/auth/token/refresh/')
    ) {
      if (isRefreshing) {
        return Promise.reject({
          status: 401,
          message: 'Sessiya yangilanmoqda. Iltimos, qayta urinib ko‘ring.',
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefToken();
      if (!refreshToken) {
        removeToken();
        removeRefToken();
        isRefreshing = false;
        return Promise.reject({
          status: 401,
          message: 'Foydalanuvchi sessiyasi tugagan. Qaytadan kiring.',
        });
      }

      try {
        const response = await axios.post<{ access: string }>(
          `${BASE_URL}/api/v1/auth/token/refresh/`,
          { refresh: refreshToken },
        );

        const newAccessToken = response.data.access;
        saveToken(newAccessToken);

        httpClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return httpClient(originalRequest);
      } catch (err: unknown) {
        processQueue(err, null);
        removeToken();
        removeRefToken();
        return Promise.reject({
          status: 401,
          message: 'Sessiya tugagan. Qaytadan tizimga kiring.',
        });
      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status;
    const data = error.response?.data as
      | { detail?: string; message?: string }
      | undefined;

    const message =
      data?.detail ||
      data?.message ||
      error.message ||
      'Server bilan bog‘liq xatolik.';

    return Promise.reject({
      ...error,
      message,
      status,
    });
  },
);

export default httpClient;
