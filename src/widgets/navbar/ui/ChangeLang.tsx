'use client';

import RU from '@/assets/RU.png';
import UZ from '@/assets/UZ.png';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/shared/ui/select';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import PublicIcon from '@mui/icons-material/Public';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function ChangeLang() {
  const { locale } = useParams<{ locale: LanguageRoutes }>();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const languages: {
    code: LanguageRoutes;
    label: string;
    flag: StaticImageData;
  }[] = [
    { code: LanguageRoutes.UZ, label: 'Oʻzbekcha', flag: UZ },
    { code: LanguageRoutes.RU, label: 'Русский', flag: RU },
    // { code: LanguageRoutes.EN, label: 'English', flag: EN },
  ];

  const changeLocale = (newLocale: LanguageRoutes) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="relative px-0 flex gap-2 text-white items-center h-full">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}
      <Select
        open={open}
        onOpenChange={setOpen}
        value={locale}
        onValueChange={(newLocale: LanguageRoutes) => changeLocale(newLocale)}
      >
        <SelectTrigger
          className="w-auto p-0 border-none bg-transparent cursor-pointer shadow-none focus:ring-0 focus:outline-none gap-2"
          aria-label="Open menu language"
        >
          <PublicIcon sx={{ color: 'white', width: '24px', height: '24px' }} />
          <p className="text-md text-white font-medium">
            {t(languages.find((l) => l.code === locale)?.label || 'Русский')}
          </p>
        </SelectTrigger>
        {open && (
          <ArrowDropUpOutlinedIcon
            sx={{
              position: 'absolute',
              bottom: '-30px',
              fontSize: '32px',
              color: 'white',
              left: '8px',
            }}
          />
        )}
        <SelectContent className="mt-1.5 border-white shadow-md bg-white mr-2 z-[999999999]">
          <SelectGroup>
            {languages.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                color={
                  lang.code === locale ? 'text-[#084FE3]' : 'text-[#212122]'
                }
                onClick={() => changeLocale(lang.code)}
                className="flex gap-2 items-center cursor-pointer"
              >
                <Image
                  src={lang.flag}
                  alt={lang.label}
                  width={24}
                  height={24}
                />
                <p
                  className={clsx(
                    'font-semibold text-sm',
                    lang.code === locale ? 'text-[#084FE3]' : 'text-[#212122]',
                  )}
                >
                  {t(lang.label)}
                </p>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
