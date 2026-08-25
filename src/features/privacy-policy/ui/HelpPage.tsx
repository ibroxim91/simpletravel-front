'use client';

import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getHelpPage } from '../lib/api';

/** Highlight numbered legal clauses like "1.", "1.1.", "2.3." inside CMS HTML. */
function enhanceLegalHtml(html: string): string {
  if (!html) return '';

  return html
    .replace(
      /<(p|li|div)([^>]*)>(\s*)(\d+\.\d+(?:\.\d+)?\.?)\s+/gi,
      '<$1$2>$3<span class="legal-clause">$4</span> ',
    )
    .replace(
      /<(h[1-6]|p)([^>]*)>(\s*)(\d+\.)\s+(?=[A-ZА-ЯЁЎҚҒҲ])/gi,
      '<$1$2 class="legal-section"$3>$4 ',
    );
}

const HelpPage = ({ type }: { type: 'privacy_policy' | 'user_agreement' }) => {
  const t = useTranslations();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['offerta', type],
    queryFn: () => getHelpPage({ page_type: type }),
    select(data) {
      return data.data.data.results;
    },
  });

  const pages = useMemo(
    () =>
      (data ?? [])
        .filter((e) => e.is_active)
        .map((e) => ({
          ...e,
          content: enhanceLegalHtml(e.content || ''),
        })),
    [data],
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (isError || !pages.length) {
    return (
      <div className="py-10 text-center text-gray-500">{t('Xatolik yuz berdi')}</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      {pages.map((e) => (
        <article key={e.id} className="space-y-8">
          <h1 className="text-center text-2xl font-bold leading-snug text-[#031753] sm:text-3xl">
            {e.title}
          </h1>

          <div
            className={[
              'legal-content text-[15px] leading-7 text-[#1C1C1E] sm:text-base sm:leading-8',
              '[&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[#031753]',
              '[&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#031753]',
              '[&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#031753]',
              '[&_h4]:mb-2 [&_h4]:mt-5 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-[#031753]',
              '[&_p]:mb-3.5 [&_p]:last:mb-0',
              '[&_p.legal-section]:mt-7 [&_p.legal-section]:mb-3 [&_p.legal-section]:text-lg [&_p.legal-section]:font-bold [&_p.legal-section]:text-[#031753]',
              '[&_.legal-clause]:mr-1 [&_.legal-clause]:font-semibold [&_.legal-clause]:text-[#031753]',
              '[&_ul]:my-4 [&_ul]:ml-1 [&_ul]:list-disc [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_ul]:marker:text-[#1A73E8]',
              '[&_ol]:my-4 [&_ol]:ml-1 [&_ol]:list-decimal [&_ol]:space-y-2.5 [&_ol]:pl-5 [&_ol]:marker:font-semibold [&_ol]:marker:text-[#031753]',
              '[&_li]:pl-1 [&_li]:leading-7',
              '[&_strong]:font-semibold [&_b]:font-semibold',
              '[&_a]:font-medium [&_a]:text-[#1A73E8] [&_a]:underline-offset-2 hover:[&_a]:underline',
              '[&_hr]:my-8 [&_hr]:border-[#E5E7EB]',
              '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#1A73E8] [&_blockquote]:bg-[#F8FAFC] [&_blockquote]:px-4 [&_blockquote]:py-3',
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: e.content }}
          />
        </article>
      ))}
    </div>
  );
};

export default HelpPage;
