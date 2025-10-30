'use client';

import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getHelpPage } from '../lib/api';

const HelpPage = ({ type }: { type: 'privacy_policy' | 'user_agreement' }) => {
  const t = useTranslations();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['offerta', type],
    queryFn: () => getHelpPage({ page_type: type }),
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

export default HelpPage;
