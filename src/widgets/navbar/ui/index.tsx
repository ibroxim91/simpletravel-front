'use client';

import Logo from '@/assets/navLogo.png';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PublicIcon from '@mui/icons-material/Public';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Navbar = () => {
  const t = useTranslations();
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Главная' },
    { href: '/tours', label: 'Подобрать тур' },
    { href: '/about', label: 'О нас' },
    { href: '/blogs', label: 'Блоги' },
    { href: '/faq', label: 'Ответы на вопросы' },
    { href: '/contacts', label: 'Контакты' },
  ];

  return (
    <section className="sticky w-full top-0">
      <div className="bg-[#031753] p-2">
        <div className="flex custom-container px-0 justify-between">
          <div className="px-0 flex gap-2 text-white items-center">
            <LocationOnIcon
              sx={{ color: 'white', width: '28px', height: '28px' }}
            />
            <p className="text-sm">{t('Укажите город')}</p>
            <ChevronRightIcon
              sx={{
                color: 'white',
                width: '24px',
                height: '24px',
              }}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2 text-white items-center">
              <PublicIcon
                sx={{ color: 'white', width: '24px', height: '24px' }}
              />
              <p className="text-sm">{t('Русский')}</p>
            </div>
            <div className="w-[1px] h-[60%] bg-white" />
            <div className="flex gap-2 text-white items-center">
              <EmailIcon
                sx={{ color: 'white', width: '24px', height: '24px' }}
              />
              <p className="text-sm">{t('Tourex@gmail.com')}</p>
            </div>
            <div className="w-[1px] h-[60%] bg-white" />
            <div className="flex gap-2 text-white items-center">
              <LocalPhoneIcon
                sx={{ color: 'white', width: '24px', height: '24px' }}
              />
              <p className="text-sm">90 222 29 22</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] w-full shadow-md rounded-b-xl p-2">
        <div className="flex justify-between custom-container px-0 w-full">
          <div className="w-full h-16 flex items-center gap-8">
            <Image
              src={Logo}
              alt="Logo"
              width={120}
              height={40}
              priority
              className="h-auto w-auto"
            />
            <div className="flex gap-4 items-center justify-center h-full">
              {links.map(({ href, label }) => (
                <div
                  key={label}
                  className={clsx(
                    'h-full flex items-center',
                    pathname === href
                      ? 'text-blue-600 border-b border-b-blue-600 underline-offset-4'
                      : 'text-black hover:text-blue-600',
                  )}
                >
                  <Link href={href}>{label}</Link>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* <Link href={'#'} className="border border-ring rounded-full p-2">
              <FavoriteIcon
                sx={{ color: 'black', width: '24px', height: '24px' }}
              />
            </Link> */}
            <IconButton
              aria-label="favourite"
              sx={{
                border: '1px solid #9ca3af',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <FavoriteIcon
                sx={{ color: 'black', width: '24px', height: '24px' }}
              />
            </IconButton>
            <div className="w-[1px] h-[30%] bg-ring" />
            <Link href={'login'}>
              <Button
                variant="contained"
                size="large"
                sx={{ borderRadius: '34px', gap: '8px' }}
              >
                <PersonIcon
                  sx={{ color: 'white', width: '24px', height: '24px' }}
                />
                <p>{t('Войти')}</p>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
