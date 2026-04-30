'use client';

import Logo from '@/assets/navLogo.png';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CloseIcon from '@mui/icons-material/Close';
import FlightIcon from '@mui/icons-material/Flight';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HomeIcon from '@mui/icons-material/Home';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { ChangeLang } from './ChangeLang';

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const MobileNavbar = ({ setOpen, open }: Props) => {
  const pathname = usePathname();
  const t = useTranslations();
  const links = [
    { href: '/', label: 'Главная', icon: HomeIcon, active: '/' },
    {
      href: '/selectour?page=1',
      label: 'Подобрать тур',
      icon: FlightIcon,
      active: '/selectour',
    },
    { href: '/about', label: 'О нас', icon: ApartmentIcon, active: '/about' },
    { href: '/contacts', label: 'Контакты', icon: LocalPhoneIcon, active: '/contacts' },
    {
      href: '/auth/register',
      label: 'Зарегистрироваться',
      icon: GroupAddIcon,
      active: '/auth/register',
    },
  ];

  const isActiveLink = (active: string) =>
    active === '/' ? pathname === '/' : pathname.startsWith(active);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100vw',
          maxWidth: '100vw',
          background: '#E8F1FF',
          backdropFilter: 'blur(5.43656px)',
          boxShadow: 'none',
        },
      }}
    >
      <div className="flex h-full w-full flex-col px-5 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full border border-[#C5CEDD] bg-white/70 px-2 py-1">
            <ChangeLang compact theme="light" />
          </div>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              width: '40px',
              height: '40px',
              borderRadius: '6px',
              backgroundColor: '#FF6B00',
              '&:hover': { backgroundColor: '#FF6B00' },
            }}
          >
            <CloseIcon sx={{ color: '#FFFFFF', width: '22px', height: '22px' }} />
          </IconButton>
        </div>

        <div className="mt-12 flex w-[257px] flex-col gap-8">
          {links.map(({ href, label, icon: Icon, active }) => (
            <Link
              href={href}
              key={label}
              onClick={() => setOpen(false)}
              className="flex h-6 items-center gap-4"
            >
              <Icon
                sx={{
                  width: '24px',
                  height: '24px',
                  color: isActiveLink(active) ? '#1A73E8' : '#6B7280',
                }}
              />
              <span
                className={clsx(
                  'text-[20px] leading-6',
                  isActiveLink(active) ? 'font-semibold text-[#1A73E8]' : 'font-medium text-[#6B7280]',
                )}
              >
                {t(label)}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-auto flex w-full max-w-[353px] flex-col gap-8">
          <div className="h-px w-full bg-[rgba(17,34,17,0.25)]" />

          <div className="flex w-full flex-col gap-6">
            <div className="flex w-[265px] flex-col gap-2">
              <p className="text-[14px] font-semibold leading-[17px] text-[#1A73E8]">
                +998 95 953-10-70
              </p>
              <p className="text-[14px] font-medium leading-[17px] text-[#6B7280]">
                бесплатный звонок и консультация
              </p>
            </div>

            <div className="flex w-full flex-col gap-8">
              <div className="flex w-full flex-col gap-2">
                <p className="text-[14px] font-medium leading-[17px] text-[#6B7280]">
                  {t('Адрес:')}
                </p>
                <p className="w-full text-[14px] font-semibold leading-[17px] text-[#1A73E8]">
                  Baxodir ko&apos;chasi 44A, Yakkasaroy Tumani, Toshkent, 100100,
                  O&apos;zbekiston
                </p>
              </div>

              <Link href="/" onClick={() => setOpen(false)} className="inline-flex w-fit">
                <Image
                  src={Logo}
                  alt="Simple Travel"
                  width={126}
                  height={41}
                  priority
                  className="h-[41px] w-[126px]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileNavbar;
