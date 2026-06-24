'use client';

import { Link } from '@/shared/config/i18n/navigation';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useTranslations } from 'next-intl';

export default function ShareTourNotFound() {
  const t = useTranslations();

  return (
    <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF4EC]">
        <TravelExploreIcon sx={{ fontSize: 48, color: '#F08125' }} />
      </div>
      <h1 className="text-2xl font-semibold text-[#031753] max-w-md">
        {t('Tur topilmadi yoki aktual emas')}
      </h1>
      <p className="mt-3 text-[#646465] max-w-sm">
        {t('Ushbu havola muddati tugagan yoki tur endi mavjud emas bo‘lishi mumkin')}
      </p>
      <Link
        href="/selectour"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-[#084FE3] px-8 py-3 text-white font-medium hover:bg-[#0640b8] transition-colors"
      >
        {t('Подобрать тур')}
      </Link>
    </div>
  );
}
