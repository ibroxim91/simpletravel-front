'use client';

import Logo from '@/assets/navLogo.png';
import { Link, usePathname } from '@/shared/config/i18n/navigation';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Dispatch, SetStateAction, Suspense } from 'react';
import { ChangeLang } from './ChangeLang';
import CitySelect from './CitySelect';
import CitySelectMobile from './CitySelectMobile';

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const MobileNavbar = ({ setOpen, open }: Props) => {
  const pathname = usePathname();
  const t = useTranslations();
  const links = [
    { href: '/', label: 'Главная' },
    { href: '/about', label: 'О нас' },
    { href: '/blogs', label: 'Блоги' },
    { href: '/faq', label: 'Ответы на вопросы' },
    { href: '/contacts', label: 'Контакты' },
  ];
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        position: 'sticky',
        top: '0px',
        bgcolor: '#edeef1',
      }}
    >
      <div className="w-screen" />
      <div className="bg-[#031753] p-2 relative">
        <div className="flex custom-container px-0 justify-between">
          <Suspense>
            <CitySelect />
          </Suspense>
          <Suspense>
            <CitySelectMobile />
          </Suspense>
          <div className="flex gap-4 items-center">
            <ChangeLang />
          </div>
        </div>
      </div>
      <div className="bg-[#FFFFFF] w-full shadow-sm rounded-b-2xl p-2">
        <div className="flex justify-between custom-container px-0 w-full">
          <div className="w-full h-16 flex items-center gap-8">
            <Link href={'/'}>
              <Image
                src={Logo}
                alt="Logo"
                width={120}
                height={40}
                priority
                className="h-auto w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ border: '1px solid gray' }}
            >
              <CloseIcon
                sx={{ color: 'black', width: '20px', height: '20px' }}
              />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-start mt-4 custom-container justify-start h-full flex-col">
        <p className="text-xl text-[#212122] font-semibold">{t('Меню')}</p>
        {links.map(({ href, label }) => (
          <Link
            href={href}
            key={label}
            onClick={() => setOpen(false)}
            className={clsx(
              'w-full py-4 px-4 rounded-2xl sticky z-30',
              pathname === href
                ? 'bg-[#084FE3] text-[#FFFFFF] shadow-sm'
                : 'bg-[#F8F8F8] text-[#212122] shadow-sm',
            )}
          >
            {t(label)}
          </Link>
        ))}
        <Link
          href={'mailto:Tourex@gmail.com'}
          className="flex gap-2 text-[#212122] items-center"
        >
          <EmailIcon sx={{ color: '#084FE3', width: '26px', height: '26px' }} />
          <p className="text-sm text-[#212122]">Tourex@gmail.com</p>
        </Link>
        <Link
          href={'tel:+998902222922'}
          className="flex gap-2 text-black items-center"
        >
          <LocalPhoneIcon
            sx={{ color: '#084FE3', width: '26px', height: '26px' }}
          />
          <p className="text-sm text-[#212122]">90 222 29 22</p>
        </Link>
      </div>
    </Drawer>
  );
};

export default MobileNavbar;
