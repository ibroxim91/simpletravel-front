'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ShareTourSearching() {
  const t = useTranslations();

  return (
    <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#ECF2FF]">
        <Search className="h-10 w-10 text-[#084FE3] animate-pulse" />
        <span className="absolute inset-0 rounded-full border-2 border-[#084FE3]/20 animate-ping" />
      </div>
      <h1 className="text-2xl font-semibold text-[#031753] max-w-md">
        {t('search_tour_detail')}
      </h1>
      <p className="mt-3 text-[#646465] max-w-sm">
        {t('waiting_for_data')}
      </p>
    </div>
  );
}
