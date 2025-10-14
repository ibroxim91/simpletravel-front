import { PRODUCT_INFO } from '@/shared/constants/data';
import '@fortawesome/fontawesome-svg-core/styles.css'; // MUHIM
import { Metadata } from 'next';
import { ReactNode } from 'react';
import '../types/fontawesome'; // iconlarni initialize qilish uchun

export const metadata: Metadata = {
  title: PRODUCT_INFO.name,
  description: PRODUCT_INFO.desc,
  keywords: PRODUCT_INFO.keyword,
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
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children;
}
