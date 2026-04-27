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

type ChangeLangProps = {
  compact?: boolean;
  theme?: 'dark' | 'light';
};

export function ChangeLang({ compact = false, theme = 'dark' }: ChangeLangProps) {
  const { locale } = useParams<{ locale: LanguageRoutes }>();
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isLight = theme === 'light';

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
    <div
      className={clsx(
        'relative px-0 flex gap-2 items-center h-full',
        isLight ? 'text-[#6B7280]' : 'text-white',
      )}
    >
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
          className={clsx(
            'w-auto border-none bg-transparent cursor-pointer shadow-none focus:ring-0 focus:outline-none',
            compact ? 'p-0 min-h-0 h-auto gap-0' : 'p-0 gap-2',
          )}
          aria-label="Open menu language"
        >
          {!compact && (
            <PublicIcon
              sx={{ color: isLight ? '#6B7280' : 'white', width: '24px', height: '24px' }}
            />
          )}
          <p
            className={clsx(
              compact ? 'text-[16px] leading-[100%] font-bold' : 'text-md font-medium',
              isLight ? 'text-[#6B7280]' : 'text-white',
            )}
          >
            {compact
              ? String(locale || LanguageRoutes.RU).toUpperCase()
              : t(languages.find((l) => l.code === locale)?.label || 'Русский')}
          </p>
        </SelectTrigger>
        {open && (
          <ArrowDropUpOutlinedIcon
            sx={{
              position: 'absolute',
              bottom: '-30px',
              fontSize: '32px',
              color: isLight ? '#FFFFFF' : 'white',
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
