import { Golos_Text } from 'next/font/google';
import localFont from 'next/font/local';

const golosText = Golos_Text({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-golos-text',
  subsets: ['latin', 'cyrillic'],
});

const sfPro = localFont({
  src: [
    {
      path: '../../../public/fonts/SF-Pro-Display-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/SF-Pro-Display-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/SF-Pro-Display-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/SF-Pro-Display-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sf-pro',
  display: 'swap',
});

const monserrat = localFont({
  src: [
    {
      path: '../../../public/fonts/Montserrat-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Montserrat-Bold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/Montserrat-ExtraBold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-montserrat',
  display: 'swap',
});

export { golosText, monserrat, sfPro };
