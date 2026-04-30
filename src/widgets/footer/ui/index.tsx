'use client';

import Logo from '@/assets/LogoWhite.png';
import { getOfferta } from '@/features/legal-offerta/lib/api';
import { getHelpPage } from '@/features/privacy-policy/lib/api';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import formatPhone from '@/shared/lib/formatPhone';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getContact } from '../lib/api';

const authRoutes = [
  '/auth/edit-password',
  '/auth/forget-password',
  '/auth/register',
  '/auth/login',
];

const defaultPhoneNumber = '+998 95 953 10 70';

const Footer = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ['get_contact'],
    queryFn: () => getContact(),
    select(data) {
      return data.data.data.results;
    },
  });

  const { data: offerta } = useQuery({
    queryKey: ['offerta'],
    queryFn: () => getOfferta({ person_type: 'individual' }),
    select(data) {
      return data.data.data.results;
    },
  });

  const { data: PrivacyPolicy } = useQuery({
    queryKey: ['privacy_policy'],
    queryFn: () => getHelpPage({ page_type: 'privacy_policy' }),
    select(data) {
      return data.data.data.results;
    },
  });

  const { data: UserAgreement } = useQuery({
    queryKey: ['user_agreement'],
    queryFn: () => getHelpPage({ page_type: 'user_agreement' }),
    select(data) {
      return data.data.data.results;
    },
  });

  const { data: legalOffer } = useQuery({
    queryKey: ['legal_entity'],
    queryFn: () => getOfferta({ person_type: 'legal_entity' }),
    select(data) {
      return data.data.data.results;
    },
  });

  if (authRoutes.includes(pathname)) {
    return null;
  }

  const whatsappHref = `https://wa.me/${defaultPhoneNumber.replace(/\D/g, '')}`;

  const socialLinks = [
    { key: 'telegram', href: data?.[0]?.telegram || '#', icon: <TelegramIcon sx={{ color: '#1A73E8', width: 16, height: 16 }} /> },
    { key: 'whatsapp', href: whatsappHref, icon: <WhatsAppIcon sx={{ color: '#1A73E8', width: 20, height: 20 }} /> },
    { key: 'facebook', href: data?.[0]?.facebook || '#', icon: <FacebookOutlinedIcon sx={{ color: '#1A73E8', width: 16, height: 16 }} /> },
    { key: 'linkedin', href: data?.[0]?.linkedin || '#', icon: <LinkedInIcon sx={{ color: '#1A73E8', width: 16, height: 16 }} /> },
    { key: 'instagram', href: data?.[0]?.instagram || '#', icon: <InstagramIcon sx={{ color: '#1A73E8', width: 16, height: 16 }} /> },
    { key: 'twitter', href: data?.[0]?.twitter || '#', icon: <XIcon sx={{ color: '#1A73E8', width: 14, height: 14 }} /> },
  ];
  const paymentLogos = [
    { src: '/humo.png', alt: 'Humo', width: 54 },
    { src: '/uzcard.png', alt: 'Uzcard', width: 52 },
    { src: '/uzumbank.png', alt: 'Uzum bank', width: 52 },
    { src: '/visa.png', alt: 'Visa', width: 52 },
    { src: '/mastercard.png', alt: 'Mastercard', width: 52 },
  ];

  return (
    <section className="bg-[#1A73E8] pb-10 pt-[56px] max-lg:mb-16 max-lg:pt-10">
      <div className="mx-auto w-full max-w-[1241px] px-4">
        <div className="flex items-start justify-between gap-10 max-lg:hidden">
          <div className="w-full max-w-[398px]">
            <Image
              src={Logo}
              alt="Simple Travel"
              width={187}
              height={60}
              priority
              className="h-[60px] w-[187px]"
            />
            <p className="mt-6 text-base font-medium leading-[22px] text-white">
              {t('Туристическое агентство из Ташкента (Узбекистан)')}
            </p>

            <div className="mt-9 space-y-6">
              <div className="space-y-2">
                <p className="text-base font-medium leading-[22px] text-white">
                  {t('Связаться с оператором:')}
                </p>
                <p className="text-base font-bold leading-[22px] text-white">
                  {defaultPhoneNumber}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-base font-medium leading-[22px] text-white">
                  {t('Адрес:')}
                </p>
                <p className="text-base font-bold leading-[22px] text-white">
                  {data?.[0]?.address || "Baxodir ko'chasi 44A, Yakkasaroy Tumani, Toshkent, 100100, Oʻzbekiston"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[609px] space-y-10">
            <div className="flex items-start gap-6 max-md:grid max-md:grid-cols-2 max-md:gap-8 max-sm:grid-cols-1">
              <div className="w-[187px] space-y-8">
                <p className="text-xl font-bold leading-[27px] text-white">{t('Бронирование:')}</p>
                <div className="flex flex-col gap-4 text-base font-medium leading-[22px] text-white">
                  <Link href="/selectour" className="w-fit">{t('Подобрать тур')}</Link>
                  <Link href="/contacts" className="w-fit">{t('Контакты')}</Link>
                </div>
              </div>

              <div className="w-[187px] space-y-8">
                <p className="text-xl font-bold leading-[27px] text-white">{t('Компания:')}</p>
                <div className="flex flex-col gap-4 text-base font-medium leading-[22px] text-white">
                  <Link href="/about" className="w-fit">{t('О нас')}</Link>
                  <Link href="/blogs" className="w-fit">{t('Блог')}</Link>
                  <Link href="/faq" className="w-fit">{t('Ответы на вопросы')}</Link>
                </div>
              </div>

              <div className="w-[187px] space-y-8">
                <p className="text-xl font-bold leading-[27px] text-white">{t('Сервисы:')}</p>
                <div className="flex flex-col gap-4 text-base font-medium leading-[22px] text-white">
                  <Link href="/contacts" className="w-fit">{t('Услуги')}</Link>
                  {(offerta && offerta.length !== 0) && (
                    <Link href="/public-offer" prefetch className="w-fit">{t('Публичная оферта')}</Link>
                  )}
                  {(legalOffer && legalOffer.length !== 0) && (
                    <Link href="/legal-offerta" prefetch className="w-fit">{t('Оферта для юрлиц')}</Link>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 max-md:flex-col max-md:items-start">
              <p className="text-xl font-bold leading-[27px] text-white">{t('Способы оплаты:')}</p>
              <div className="flex items-center gap-6">
                {paymentLogos.map((logo) => (
                  <div key={logo.src} className="h-8 w-[54px] overflow-hidden rounded-[2px] bg-white">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={32}
                      className="h-8 w-auto max-w-[54px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6 max-lg:hidden">
          <p className="text-base font-bold leading-[22px] text-white">{t('Мы в социальных сетях:')}</p>
          <div className="flex items-center gap-2">
            {socialLinks.map((item) => (
              <a key={item.key} href={item.href} aria-label={item.key} target="_blank" rel="noopener noreferrer">
                <IconButton
                  sx={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#D9D9D9',
                    padding: 0,
                    '&:hover': { backgroundColor: '#E5E7EB' },
                  }}
                >
                  {item.icon}
                </IconButton>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[#E5E7EB] max-lg:hidden" />
        <p className="mt-8 text-base font-bold leading-[22px] text-white max-lg:hidden">
          © 2020-2026 Simple Travel
        </p>
      </div>

      <div className="mx-auto w-full max-w-[393px] px-5 lg:hidden">
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Image
              src={Logo}
              alt="Simple Travel"
              width={131}
              height={42}
              priority
              className="h-[42px] w-[131px]"
            />

            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <p className="text-[14px] font-medium leading-8 text-[#E5E7EB]">
                  {t('Связаться с оператором:')}
                </p>
                <p className="text-[14px] font-bold leading-[22px] text-[#E5E7EB]">
                  {defaultPhoneNumber}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[14px] font-medium leading-8 text-[#E5E7EB]">
                  {t('Адрес:')}
                </p>
                <p className="text-[14px] font-medium leading-[22px] text-[#E5E7EB]">
                  {data?.[0]?.address || "Baxodir ko'chasi 44A, Yakkasaroy Tumani, Toshkent, 100100, Oʻzbekiston"}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-[20px] font-bold leading-10 text-[#E5E7EB]">{t('Мы в социальных сетях:')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {socialLinks.map((item) => (
                  <a key={item.key} href={item.href} aria-label={item.key} target="_blank" rel="noopener noreferrer">
                    <IconButton
                      sx={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#D9D9D9',
                        padding: 0,
                        '&:hover': { backgroundColor: '#E5E7EB' },
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-[58px]">
            <div className="space-y-7">
              <div className="space-y-3">
                <p className="text-[20px] font-bold leading-10 text-[#E5E7EB]">{t('Бронирование:')}</p>
                <div className="flex flex-col gap-2 text-[16px] font-medium leading-10 text-[#E5E7EB]">
                  <Link href="/selectour" className="w-fit">{t('Подобрать тур')}</Link>
                  <Link href="/contacts" className="w-fit">{t('Контакты')}</Link>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[20px] font-bold leading-10 text-[#E5E7EB]">{t('Компания:')}</p>
                <div className="flex flex-col gap-2 text-[16px] font-medium leading-10 text-[#E5E7EB]">
                  <Link href="/about" className="w-fit">{t('О нас')}</Link>
                  <Link href="/blogs" className="w-fit">{t('Блог')}</Link>
                  <Link href="/faq" className="w-fit">{t('Ответы на вопросы')}</Link>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[20px] font-bold leading-10 text-[#E5E7EB]">{t('Сервисы:')}</p>
                <div className="flex flex-col gap-2 text-[16px] font-medium leading-10 text-[#E5E7EB]">
                  <Link href="/contacts" className="w-fit">{t('Услуги')}</Link>
                  {(offerta && offerta.length !== 0) && (
                    <Link href="/public-offer" prefetch className="w-fit">{t('Публичная оферта')}</Link>
                  )}
                  {(legalOffer && legalOffer.length !== 0) && (
                    <Link href="/legal-offerta" prefetch className="w-fit">{t('Оферта для юрлиц')}</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[20px] font-bold leading-10 text-[#E5E7EB]">{t('Способы оплаты:')}</p>
          <div className="mt-2 flex items-center gap-2">
            {paymentLogos.map((logo) => (
              <div key={logo.src} className="h-8 w-[54px] overflow-hidden rounded-[2px] bg-white">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={32}
                  className="h-8 w-auto max-w-[54px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[#E5E7EB]" />
        <p className="mt-10 text-[18px] font-bold leading-[22px] text-[#E5E7EB]">
          © 2020-2026 Simple Travel
        </p>
      </div>
    </section>
  );
};

export default Footer;
