'use client';

import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getOfferta } from '../lib/api';

const LegalOffertaUi = ({ type }: { type: 'individual' | 'legal_entity' }) => {
  const t = useTranslations();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['offerta', type],
    queryFn: () => getOfferta({ person_type: type }),
    select(data) {
      return data.data.data.results;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !data?.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        {t('Xatolik yuz berdi')}
      </div>
    );
  }

  return (
    <div className="custom-container px-4 py-10">
      {data.map((e) => (
        <div key={e.id}>
          {e.is_active && (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">{e.title}</h1>

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: e.content }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default LegalOffertaUi;
