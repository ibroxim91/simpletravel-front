'use client';

import Logo from '@/assets/navLogo.png';
import LogoWhite from '@/assets/LogoWhite.png';
import { User_Api } from '@/features/profile/lib/api';
import { useWelcomeStore } from '@/features/profile/lib/hook';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
      icon: FavoriteBorderIcon,
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
      <section className="sticky top-0 z-50 w-full bg-[#1A73E8] xl:bg-[#FAFBFC]">
        <div className="custom-container h-[72px] xl:h-[102px]">
          <div className="mx-auto flex h-full w-full max-w-[1240px] items-center">
            <div className="hidden h-full w-full items-center justify-between xl:flex">
              <Link href="/" className="shrink-0">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={148}
                  height={56}
                  priority
                  className="h-auto w-[148px] 2xl:w-[164px]"
                />
              </Link>

              <div className="flex min-w-0 items-center gap-8 2xl:gap-[68px]">
                <div className="flex h-full items-center gap-6 whitespace-nowrap 2xl:gap-9">
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
                      <FavoriteBorderIcon
                        sx={{ color: '#6B7280', width: '22px', height: '20px' }}
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

            <div className="flex h-full w-full items-center justify-between xl:hidden px-1">
              <Link href="/" className="shrink-0">
                <Image
                  src={LogoWhite}
                  alt="Logo"
                  width={98}
                  height={32}
                  priority
                  className="h-auto w-[98px]"
                />
              </Link>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <Link href="/saved" aria-label="Saved tours">
                    <IconButton
                      sx={{
                        p: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '20px',
                        color: '#FFFFFF',
                      }}
                    >
                      <FavoriteBorderIcon sx={{ width: '20px', height: '18px' }} />
                    </IconButton>
                  </Link>
                  <Link href={profileHref} aria-label="Profile">
                    <IconButton
                      sx={{
                        p: 0,
                        width: '36px',
                        height: '36px',
                        borderRadius: '20px',
                        color: '#FFFFFF',
                      }}
                    >
                      <PersonIcon sx={{ width: '22px', height: '22px' }} />
                    </IconButton>
                  </Link>
                </div>
                <IconButton
                  onClick={() => setOpenMobile(true)}
                  aria-label="Open menu"
                  sx={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #FFFFFF',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    p: 0,
                  }}
                >
                  <MenuIcon sx={{ width: '24px', height: '24px' }} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        <MobileNavbar open={openMobie} setOpen={setOpenMobile} />
      </section>
      {/* Mobile bottom navigation temporarily disabled */}
    </>
  );
};

export default Navbar;
