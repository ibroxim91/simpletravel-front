'use client';

import Logo from '@/assets/LogoWhite.png';
import { getOfferta } from '@/features/legal-offerta/lib/api';
import { getHelpPage } from '@/features/privacy-policy/lib/api';
import { Link } from '@/shared/config/i18n/navigation';
import formatPhone from '@/shared/lib/formatPhone';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getContact } from '../lib/api';

const Footer = () => {
  const t = useTranslations();
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

  return (
    <section className="py-8 bg-[#084FE3] rounded-t-4xl max-lg:mb-16">
      <div className="custom-container">
        <div className="flex items-center">
          <div className="w-full h-12 flex items-center gap-8">
            <Image
              src={Logo}
              alt="Logo"
              width={120}
              height={40}
              priority
              className="h-full w-auto size-12"
            />
          </div>
          <div className="flex gap-4 max-lg:hidden">
            {data && data[0].telegram && (
              <Link href={data[0].telegram}>
                <IconButton
                  sx={{ border: '1px solid var(--ring)' }}
                  aria-label="Link to LinkedIn"
                >
                  <TelegramIcon
                    sx={{ color: 'white', width: '28px', height: '28px' }}
                  />
                </IconButton>
              </Link>
            )}
            {data && data[0].linkedin && (
              <Link href={data[0].linkedin}>
                <IconButton
                  sx={{ border: '1px solid var(--ring)' }}
                  aria-label="Link to LinkedIn"
                >
                  <LinkedInIcon
                    sx={{ color: 'white', width: '28px', height: '28px' }}
                  />
                </IconButton>
              </Link>
            )}
            {data && data[0].twitter && (
              <Link href={data[0].twitter}>
                <IconButton
                  sx={{ border: '1px solid var(--ring)' }}
                  aria-label="Link to Twitter"
                >
                  <XIcon
                    sx={{ color: 'white', width: '28px', height: '28px' }}
                  />
                </IconButton>
              </Link>
            )}
            {data && data[0].instagram && (
              <Link href={data[0].instagram}>
                <IconButton
                  sx={{ border: '1px solid var(--ring)' }}
                  aria-label="Link to Instagram"
                >
                  <InstagramIcon
                    sx={{ color: 'white', width: '28px', height: '28px' }}
                  />
                </IconButton>
              </Link>
            )}
            {data && data[0].facebook && (
              <Link href={data[0].facebook}>
                <IconButton
                  sx={{ border: '1px solid var(--ring)' }}
                  aria-label="Link to facebook"
                >
                  <FacebookOutlinedIcon
                    sx={{ color: 'white', width: '28px', height: '28px' }}
                  />
                </IconButton>
              </Link>
            )}
          </div>
        </div>
        <div className="w-full h-[1px] bg-ring mt-10" />
        <div className="grid grid-cols-4 font-medium max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 max-lg:gap-10 mt-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[#D3D3D3] text-sm">{t('Служба поддержки')}</p>
              <p className="text-[#FFFFFF] text-lg font-semibold">
                {data && formatPhone(data[0].main_phone)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#D3D3D3] text-sm">{t('Общие вопросы')}</p>
              <p className="text-[#FFFFFF] text-lg font-semibold">
                {data && data[0].email}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#D3D3D3] text-sm">{t('Адрес')}</p>
              <p className="text-[#FFFFFF] text-sm font-semibold">
                {data && data[0].address}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[#FFFFFF] text-lg font-semibold">
                {t('Страница')}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Link href={'/'} className="text-[#D3D3D3] text-sm w-fit">
                {t('Главная')}
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href={'/selectour'}
                className="text-[#D3D3D3] text-sm w-fit"
              >
                {t('Подобрать тур')}
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <Link href={'/blogs'} className="text-[#D3D3D3] text-sm w-fit">
                {t('Блоги')}
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[#FFFFFF] text-lg font-semibold">
                {t('О сервисе')}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Link href={'/about'} className="text-[#D3D3D3] text-sm w-fit">
                {t('О нас')}
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <Link href={'/contacts'} className="text-[#D3D3D3] text-sm w-fit">
                {t('Услуги')}
              </Link>
            </div>
            {offerta && offerta.length !== 0 && (
              <div className="flex flex-col gap-1">
                <Link
                  href={'/public-offer'}
                  prefetch={true}
                  className="text-[#D3D3D3] text-sm w-fit"
                >
                  {t('Публичная оферта')}
                </Link>
              </div>
            )}
            {legalOffer && legalOffer.length !== 0 && (
              <div className="flex flex-col gap-1">
                <Link
                  href={'/legal-offerta'}
                  prefetch={true}
                  className="text-[#D3D3D3] text-sm w-fit"
                >
                  {t('Оферта для юрлиц')}
                </Link>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[#FFFFFF] text-lg font-semibold">
                {t('Помощь')}
              </p>
            </div>
            {UserAgreement && UserAgreement.length !== 0 && (
              <Link
                href={'/user-agreement'}
                prefetch={true}
                className="text-[#D3D3D3] text-sm w-fit"
              >
                <p className="text-[#D3D3D3] text-sm">
                  {t('Инструкция пользователя')}
                </p>
              </Link>
            )}
            {PrivacyPolicy && PrivacyPolicy.length !== 0 && (
              <div className="flex flex-col gap-1">
                <Link
                  href={'/privacy-policy'}
                  className="text-[#D3D3D3] text-sm w-fit"
                  prefetch={true}
                >
                  {t('Политика конфиденциальности')}
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-[1px] bg-ring mt-10" />
        <div className="flex gap-4 min-lg:hidden mt-10">
          <Link href={'https://www.linkedin.com/'} aria-label="Linkedin">
            <IconButton sx={{ border: '1px solid var(--ring)' }}>
              <LinkedInIcon
                sx={{ color: 'white', width: '28px', height: '28px' }}
              />
            </IconButton>
          </Link>
          <Link href={'https://x.com/'} aria-label="twitter">
            <IconButton sx={{ border: '1px solid var(--ring)' }}>
              <XIcon sx={{ color: 'white', width: '28px', height: '28px' }} />
            </IconButton>
          </Link>
          <Link href={'https://www.instagram.com/'} aria-label="instagram">
            <IconButton sx={{ border: '1px solid var(--ring)' }}>
              <InstagramIcon
                sx={{ color: 'white', width: '28px', height: '28px' }}
              />
            </IconButton>
          </Link>
          <Link href={'#https://www.facebook.com/'} aria-label="facebook">
            <IconButton sx={{ border: '1px solid var(--ring)' }}>
              <FacebookOutlinedIcon
                sx={{ color: 'white', width: '28px', height: '28px' }}
              />
            </IconButton>
          </Link>
        </div>
        <p className="mt-10 text-white font-medium text-sm">
          {t(
            '«simpletravel» Подробные сведения, политика конфиденциальности и пользовательское соглашение размещены в разделе «Документы и файлы»',
          )}
        </p>
      </div>
    </section>
  );
};

export default Footer;
