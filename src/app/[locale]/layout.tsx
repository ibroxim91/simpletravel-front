import { golosText } from '@/shared/config/fonts';
import { routing } from '@/shared/config/i18n/routing';
import QueryProvider from '@/shared/config/react-query/QueryProvider';
import { ThemeProvider } from '@/shared/config/theme-provider';
import { PRODUCT_INFO } from '@/shared/constants/data';
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
  description: PRODUCT_INFO.description,
  icons: PRODUCT_INFO.favicon,
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
        className={`${golosText.variable} antialiased min-h-screen flex flex-col relative`}
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
