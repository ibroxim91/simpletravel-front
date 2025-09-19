'use client';

import Logo from '@/assets/navLogo.png';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { ChangeLang } from './ChangeLang';
import CitySelect from './CitySelect';
import CitySelectMobile from './CitySelectMobile';
import MobileNavbar from './MobileNavbar';

const Navbar = () => {
  const t = useTranslations();
  const pathname = usePathname();

  const [openMobie, setOpenMobile] = useState(false);

  const links = [
    { href: '/', label: 'Главная' },
    { href: '/tours', label: 'Подобрать тур' },
    { href: '/about', label: 'О нас' },
    { href: '/blogs', label: 'Блоги' },
    { href: '/faq', label: 'Ответы на вопросы' },
    { href: '/contacts', label: 'Контакты' },
  ];

  return (
    <section className="sticky w-full top-0 z-20">
      <div className="bg-[#031753] p-2 relative">
        <div className="flex custom-container justify-between items-center">
          <CitySelect />
          <CitySelectMobile />
          <div className="flex gap-4 items-center font-medium">
            <ChangeLang />
            <div className="w-[1px] h-[60%] bg-white max-lg:hidden" />
            <Link
              href={'mailto:Tourex@gmail.com'}
              className="flex gap-2 text-white items-center max-lg:hidden"
            >
              <EmailIcon
                sx={{ color: 'white', width: '24px', height: '24px' }}
              />
              <p className="text-sm">{t('Tourex@gmail.com')}</p>
            </Link>
            <div className="w-[1px] h-[60%] bg-white max-lg:hidden" />
            <Link
              href={'tel:+998902222922'}
              className="flex gap-2 text-white items-center max-lg:hidden"
            >
              <LocalPhoneIcon
                sx={{ color: 'white', width: '24px', height: '24px' }}
              />
              <p className="text-sm">90 222 29 22</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF] w-full shadow-sm rounded-b-2xl p-2">
        <div className="flex justify-between custom-container w-full">
          <div className="w-full h-16 flex items-center gap-8">
            <Image
              src={Logo}
              alt="Logo"
              width={120}
              height={40}
              priority
              className="h-auto w-auto"
            />
            <div className="flex gap-4 items-center justify-center h-full max-lg:hidden">
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
                  <Link href={href}>{t(label)}</Link>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 max-lg:hidden">
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
          <div className="flex items-center gap-4 lg:hidden">
            <IconButton
              onClick={() => setOpenMobile(true)}
              sx={{ border: '1px solid gray' }}
            >
              <MenuIcon
                sx={{ color: 'black', width: '20px', height: '20px' }}
              />
            </IconButton>
          </div>
        </div>
        <MobileNavbar open={openMobie} setOpen={setOpenMobile} />
      </div>
    </section>
  );
};

export default Navbar;
