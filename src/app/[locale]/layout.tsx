import Welcome from '@/features/profile/ui/welcome';
// import { sfPro } from '@/shared/config/fonts';
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
import { monserrat } from '@/shared/config/fonts';



export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo(locale);

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
        className={`${monserrat.className} antialiased min-h-screen flex flex-col relative`}
      >
        {/* Google metrika Code START */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TXPZGNKH');
            `}
        </Script>

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TXPZGNKH"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
        </noscript>
            {/* Google metrika Code END */}


        {/* Meta Pixel Code START */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1994237517889899');
        fbq('track', 'PageView');`}
        </Script>

        <noscript><img height="1" width="1" style={{display: 'none'}} alt=""
        src="https://www.facebook.com/tr?id=1994237517889899&ev=PageView&noscript=1"
        /></noscript>
        {/* Meta Pixel Code  END*/}


{/* Yandex Metrika */}
<Script id="yandex-metrika" strategy="afterInteractive">
  {` (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109235082', 'ym');
        
        ym(109235082, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}
</Script>
<noscript><div><img src="https://mc.yandex.ru/watch/109235082" style={{position: 'absolute', left: '-9999px'}} alt="" /></div></noscript>

{/* Yandex Metrika END */}

{/* Clarity Code START */}
<Script id="clarity" strategy="afterInteractive">
  {`
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wsy0tpxsom");
`}
</Script>

<Script src='https://t.contentsquare.net/uxa/f510ff1cc302b.js' strategy="afterInteractive"></Script>
       
        
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
