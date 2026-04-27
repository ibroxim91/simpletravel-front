'use client';

import Logo from '@/assets/navLogo.png';
import { User_Api } from '@/features/profile/lib/api';
import { useWelcomeStore } from '@/features/profile/lib/hook';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChangeLang } from './ChangeLang';
import MobileNavbar from './MobileNavbar';

const Navbar = () => {
  const pathname = usePathname();
  const { setOpenModal } = useWelcomeStore();
  const t = useTranslations();
  const [openMobie, setOpenMobile] = useState(false);
  const { data: user } = useQuery({
    queryKey: ['get_me'],
    queryFn: () => User_Api.getMe(),
  });

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/selectour?page=1', label: 'Подобрать тур' },
    { href: '/about', label: 'О нас' },
    { href: '/contacts', label: 'Контакты' },
  ];

  useEffect(() => {
    if (user && (!user.data.data.first_name || !user.data.data.last_name)) {
      setOpenModal(true);
    }
  }, [user, setOpenModal]);

  const linksMobile = [
    { href: '/', label: 'Главная', icon: HomeIcon, active: '/' },
    {
      href: '/selectour?page=1',
      label: 'Подобрать тур',
      icon: SearchIcon,
      active: '/selectour',
    },
    {
      href: '/saved',
      label: 'Избранное',
      icon: FavoriteIcon,
      active: '/saved',
    },
    {
      href: user ? '/profile?tabs=profile' : '/auth/register',
      label: 'Профиль',
      icon: PersonIcon,
      active: '/profile',
    },
  ];

  const profileHref = user ? '/profile?tabs=profile' : '/auth/register';
  const profileLabel = user ? t('Профиль') : t('Регистрация');
  const profileName = user
    ? `${user.data.data.first_name || ''} ${user.data.data.last_name || ''}`.trim()
    : '';
  const profileInitials = user
    ? `${(user.data.data.first_name || '').slice(0, 1)}${(user.data.data.last_name || '').slice(0, 1)}`.toUpperCase() || 'ST'
    : 'ST';
  const isActiveLink = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <section className="sticky top-0 z-50 w-full bg-[#FAFBFC]">
        <div className="custom-container h-[102px]">
          <div className="mx-auto flex h-full w-full max-w-[1240px] items-center">
            <div className="hidden h-full w-full items-center justify-between xl:flex">
              <Link href="/" className="shrink-0">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={187}
                  height={62}
                  priority
                  className="h-auto w-auto"
                />
              </Link>

              <div className="flex min-w-0 items-center gap-8 2xl:gap-[68px]">
                <div className="flex h-full items-center gap-5 whitespace-nowrap 2xl:gap-9">
                {navLinks.map(({ href, label }) => (
                  <div
                    key={label}
                    className={clsx(
                      'flex font-bold items-center text-[14px]',
                      isActiveLink(href)
                        ? 'text-[#1A73E8] font-bold'
                        : 'text-[#6B7280] font-medium hover:text-[#1A73E8]',
                    )}
                  >
                    <Link href={href}>{t(label)}</Link>
                  </div>
                ))}
              </div>
                <div className="flex shrink-0 items-center gap-4 xl:gap-5 2xl:gap-6">
                  <div className="h-6 w-[2px] bg-[#E5E7EB]" />
                  <Link href="/saved">
                    <IconButton
                      aria-label="favourite"
                      sx={{
                        p: 0,
                        minWidth: 0,
                        backgroundColor: 'transparent',
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      <FavoriteIcon
                        sx={{ color: '#6B7280', width: '20px', height: '18px' }}
                      />
                    </IconButton>
                  </Link>
                  <div className="flex h-9 items-center justify-center rounded-[20px] px-2 py-[9px]">
                    <ChangeLang compact theme="light" />
                  </div>
                  {user ? (
                    <>
                      <div className="h-6 w-[2px] bg-[#E5E7EB]" />
                      <Link
                        href={profileHref}
                        className="flex items-center gap-2 text-[#112211]"
                      >
                        <div className="relative">
                          <Avatar className="size-[45px]">
                            <AvatarImage src={user?.data.data.avatar || undefined} />
                            <AvatarFallback className="bg-[#E9EEF8] text-[#1A73E8] font-semibold text-sm">
                              {profileInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-[1px] -right-[1px] z-10 flex size-[20px] items-center justify-center rounded-full bg-[#1A73E8]">
                            <KeyboardArrowDownIcon
                              sx={{ width: '14px', height: '14px', color: '#FFFFFF' }}
                            />
                          </span>
                        </div>
                        <p className="text-[14px] font-semibold leading-[100%]">
                          {profileName || profileLabel}
                        </p>
                      </Link>
                    </>
                  ) : (
                    <Link href={profileHref}>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: '#FF6B00',
                          color: '#FF6B00',
                          width: '170px',
                          height: '48px',
                          borderRadius: '14px',
                          gap: '10px',
                          textTransform: 'none',
                          fontSize: '15px',
                          fontWeight: 400,
                          lineHeight: '100%',
                          '&:hover': {
                            borderColor: '#FF6B00',
                            backgroundColor: '#FFF7ED',
                          },
                          '@media (min-width: 1536px)': {
                            width: '211px',
                            gap: '16px',
                            fontSize: '16px',
                          },
                        }}
                      >
                        <PersonIcon sx={{ width: '24px', height: '24px' }} />
                        <p>{profileLabel}</p>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-full w-full items-center justify-between xl:hidden">
              <Link href="/" className="shrink-0">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={187}
                  height={62}
                  priority
                  className="h-auto w-[160px]"
                />
              </Link>
              <IconButton
                onClick={() => setOpenMobile(true)}
                sx={{ border: '1px solid gray' }}
                aria-label="Open-menu"
              >
                <MenuIcon
                  sx={{ color: 'black', width: '20px', height: '20px' }}
                />
              </IconButton>
            </div>
          </div>
        </div>
        <MobileNavbar open={openMobie} setOpen={setOpenMobile} />
      </section>
      <div className="bg-white shadow-2xl border-1 rounded-t-2xl grid grid-cols-4 justify-center items-center py-3 h-auto w-full fixed bottom-0 z-30 lg:hidden">
        {linksMobile.map((e) => (
          <Link
            href={e.href}
            key={e.label}
            className="flex flex-col justify-center items-center"
          >
            <e.icon
              sx={{
                width: '34px',
                height: '34px',
                color: e.active === pathname ? '#084FE3' : '#646465',
              }}
            />
            <p
              className={clsx(
                'max-md:text-sm text-center max-sm:text-xs',
                e.active === pathname ? 'text-[#084FE3]' : 'text-[#646465]',
              )}
            >
              {t(e.label)}
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
