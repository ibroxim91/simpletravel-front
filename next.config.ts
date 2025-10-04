import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'simple-travel.felixits.uz',
        port: '',
        pathname: '/resources/**',
      },
      {
        protocol: 'http',
        hostname: 'simple-travel.felixits.uz',
        port: '',
        pathname: '/resources/**',
      },
      {
        protocol: 'http',
        hostname: 'simple-travel.felixits.uz',
        port: '',
        pathname: '/resources/media/ticket-included-services-images/**',
      },
    ],
  },

  transpilePackages: ['@pbe/react-yandex-maps'],

  // Webpack konfiguratsiyasi - SSR muammolarini hal qilish
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side uchun fallback
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },

  // Experimental features
  experimental: {
    // Agar kerak bo'lsa package optimizatsiyasi
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/shared/config/i18n/request.ts',
  experimental: {
    createMessagesDeclaration: './src/shared/config/i18n/messages/uz.json',
  },
});

export default withNextIntl(nextConfig);
