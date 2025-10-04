'use client';

import Logo from '@/assets/LogoWhite.png';
import { Link } from '@/shared/config/i18n/navigation';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import IconButton from '@mui/material/IconButton';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Footer = () => {
  const t = useTranslations();
  return (
    <section className="py-8 bg-[#031753] rounded-t-4xl max-lg:mb-16">
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
            <Link href={'https://www.linkedin.com/'}>
              <IconButton
                sx={{ border: '1px solid var(--ring)' }}
                aria-label="Link to LinkedIn"
              >
                <LinkedInIcon
                  sx={{ color: 'white', width: '28px', height: '28px' }}
                />
              </IconButton>
            </Link>
            <Link href={'https://x.com/'}>
              <IconButton
                sx={{ border: '1px solid var(--ring)' }}
                aria-label="Link to Twitter"
              >
                <XIcon sx={{ color: 'white', width: '28px', height: '28px' }} />
              </IconButton>
            </Link>
            <Link href={'https://www.instagram.com/'}>
              <IconButton
                sx={{ border: '1px solid var(--ring)' }}
                aria-label="Link to Instagram"
              >
                <InstagramIcon
                  sx={{ color: 'white', width: '28px', height: '28px' }}
                />
              </IconButton>
            </Link>
            <Link href={'#https://www.facebook.com/'}>
              <IconButton
                sx={{ border: '1px solid var(--ring)' }}
                aria-label="Link to facebook"
              >
                <FacebookOutlinedIcon
                  sx={{ color: 'white', width: '28px', height: '28px' }}
                />
              </IconButton>
            </Link>
          </div>
        </div>
        <div className="w-full h-[1px] bg-ring mt-10" />
        <div className="grid grid-cols-4 font-medium max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 max-lg:gap-10 mt-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Служба поддержки')}</p>
              <p className="text-white font-semibold">+998 71 000 00 00</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Общие вопросы')}</p>
              <p className="text-white font-semibold">office@Simple travel</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Адрес')}</p>
              <p className="text-white font-semibold">
                {t('Тошкент шахри, Юнусобод тумани')}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">{t('Страница')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Главная')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Подобрать тур')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Блоги')}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">{t('О сервисе')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('О нас')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Услуги')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Публичная оферта')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">{t('Оферта для юрлиц')}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-white font-semibold">{t('Помощь')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">
                {t('Инструкция пользователя')}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-ring text-sm">
                {t('Политика конфиденциальности')}
              </p>
            </div>
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
        <p className="mt-10 text-white font-medium">
          {t(
            '«simpletravel» Подробные сведения, политика конфиденциальности и пользовательское соглашение размещены в разделе «Документы и файлы»',
          )}
        </p>
      </div>
    </section>
  );
};

export default Footer;
