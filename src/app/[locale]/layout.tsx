import { sfPro } from '@/shared/config/fonts';
import { routing } from '@/shared/config/i18n/routing';
import QueryProvider from '@/shared/config/react-query/QueryProvider';
import { ThemeProvider } from '@/shared/config/theme-provider';
import { PRODUCT_INFO } from '@/shared/constants/data';
import { Toaster } from '@/shared/ui/sonner';
import ConditionalFooter from '@/widgets/footer/ui/ConditionalFooter';
import Navbar from '@/widgets/navbar/ui';
import type { Metadata } from 'next';
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { ReactNode } from 'react';
import '../globals.css';

export const metadata: Metadata = {
  title: PRODUCT_INFO.name,
  description: PRODUCT_INFO.desc,
  keywords: PRODUCT_INFO.keyword,
  icons: {
    icon: '/Logo.svg',
    shortcut: '/Logo.svg',
    apple: '/Logo_blue.png',
  },
  openGraph: {
    title: PRODUCT_INFO.name,
    description: PRODUCT_INFO.desc,
    url: 'https://simple-travel-blond.vercel.app/',
    siteName: PRODUCT_INFO.name,
    images: [
      {
        url: 'https://simple-travel-blond.vercel.app/Logo_blue.png',
        width: 1200,
        height: 630,
        alt: PRODUCT_INFO.name,
      },
    ],
    type: 'website',
  },
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${sfPro.className} !font-stretch-100% antialiased min-h-screen flex flex-col relative`}
      >
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider
            attribute={'class'}
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <ConditionalFooter />
              <Toaster richColors />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
      <Script
        src="https://buttons.github.io/buttons.js"
        strategy="lazyOnload"
        async
        defer
      />
    </html>
  );
}
