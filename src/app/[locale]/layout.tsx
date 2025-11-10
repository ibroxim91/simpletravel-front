import Welcome from '@/features/profile/ui/welcome';
import { sfPro } from '@/shared/config/fonts';
import { routing } from '@/shared/config/i18n/routing';
import QueryProvider from '@/shared/config/react-query/QueryProvider';
import { ThemeProvider } from '@/shared/config/theme-provider';
import { getPageSeo } from '@/shared/lib/getPageSeo';
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
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo('/', locale);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    icons: {
      icon: [{ url: '/Logos.svg' }],
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [
        {
          url: seo.ogImage!,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [seo.ogImage!],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
    },
  };
}

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

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${sfPro.className} antialiased min-h-screen flex flex-col relative`}
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
              <Welcome />
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
