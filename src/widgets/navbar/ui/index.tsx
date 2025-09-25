'use client';

import Logo from '@/assets/navLogo.png';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import EmailIcon from '@mui/icons-material/Email';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
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

  const linksMobile = [
    { href: '/', label: 'Главная', icon: HomeIcon },
    { href: '/tours', label: 'Подобрать тур', icon: SearchIcon },
    { href: '/saved', label: 'Избранное', icon: FavoriteIcon },
    { href: '/profile', label: 'Профиль', icon: PersonIcon },
  ];

  return (
    <>
      <section className="sticky w-full top-0 z-50">
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
                      'h-full flex items-center font-semibold',
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
              <Link href={'/saved'}>
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
              </Link>
              <div className="w-[1px] h-[30%] bg-ring" />
              <Link href={'/auth/register'}>
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
      <div className="bg-white shadow-2xl border-1 rounded-t-2xl grid grid-cols-4 justify-center items-center py-3 w-full fixed bottom-0 z-30 lg:hidden">
        {linksMobile.map((e) => (
          <Link
            href={e.href}
            key={e.label}
            className="flex flex-col justify-center items-center"
          >
            <e.icon
              sx={{
                width: '36px',
                height: '36px',
                color: e.href === pathname ? '#084FE3' : '#646465',
              }}
            />
            <p
              className={clsx(
                'max-md:text-[12px]',
                e.href === pathname ? 'text-[#084FE3]' : 'text-[#646465]',
              )}
            >
              {e.label}
            </p>
          </Link>
        ))}
        {/* <div className="flex flex-col justify-center items-center">
          <SearchIcon sx={{ width: '36px', height: '36px' }} />
          <p className="max-md:text-[12px]">Найти тур</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <FavoriteIcon sx={{ width: '36px', height: '36px' }} />
          <p className="max-md:text-[12px]">Избранное</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <PersonIcon sx={{ width: '36px', height: '36px' }} />
          <p className="max-md:text-[12px]">Профиль</p>
        </div> */}
      </div>
    </>
  );
};

export default Navbar;
