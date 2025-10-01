'use client';

import EN from '@/assets/GB.png';
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
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function ChangeLang() {
  const { locale } = useParams<{ locale: LanguageRoutes }>();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const languages: {
    code: LanguageRoutes;
    label: string;
    flag: StaticImageData;
  }[] = [
    { code: LanguageRoutes.UZ, label: t('Oʻzbekcha'), flag: UZ },
    { code: LanguageRoutes.RU, label: t('Русский'), flag: RU },
    { code: LanguageRoutes.EN, label: t('English'), flag: EN },
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
          className="fixed inset-0 bg-black/40 -z-10 overflow-y-scroll"
          onClick={() => setOpen(false)}
        />
      )}
      <Select
        open={open}
        onOpenChange={setOpen}
        value={locale}
        onValueChange={(newLocale: LanguageRoutes) => changeLocale(newLocale)}
      >
        <SelectTrigger className="w-auto p-0 border-none bg-transparent cursor-pointer shadow-none focus:ring-0 focus:outline-none gap-2">
          <PublicIcon sx={{ color: 'white', width: '24px', height: '24px' }} />
          <p className="text-md text-white font-medium">
            {languages.find((l) => l.code === locale)?.label}
          </p>
        </SelectTrigger>
        {open && (
          <ArrowDropUpOutlinedIcon
            sx={{
              position: 'absolute',
              bottom: '-23px',
              zIndex: 60,
              fontSize: '32px',
              color: 'white',
              left: '8px',
            }}
          />
        )}
        <SelectContent className="mt-1.5 border-white shadow-md bg-white mr-2">
          <SelectGroup>
            {languages.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                onClick={() => changeLocale(lang.code)}
                className="flex gap-2 items-center cursor-pointer"
              >
                <Image
                  src={lang.flag}
                  alt={lang.label}
                  width={24}
                  height={24}
                />
                <p className="font-medium text-sm">{lang.label}</p>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
