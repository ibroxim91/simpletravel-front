'use client';

import { Auth_Api } from '@/features/auth/lib/api';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { removeRefToken, removeToken, getToken } from '@/shared/config/api/saveToke';
import { Button } from '@/shared/ui/button';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DeleteAccountClient() {
  const t = useTranslations();
  const router = useRouter();
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setToken(getToken() || null);
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: () => Auth_Api.deleteAccount(),
    onSuccess: () => {
      removeToken();
      removeRefToken();
      toast.success(t('delete_account_success'));
      router.replace('/');
    },
    onError: (error: AxiosError<{ detail?: string; data?: { detail?: string } }>) => {
      const detail =
        error.response?.data?.detail ||
        error.response?.data?.data?.detail ||
        t('Xatolik yuz berdi');
      toast.error(detail);
    },
  });

  if (token === undefined) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoaderCircle className="animate-spin text-[#084FE3]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-10 mb-16">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDEEF1] shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-[#212122]">
          {t('delete_account_title')}
        </h1>
        <hr className="h-[2px] bg-[#EDEEF1] mt-5 mb-6" />

        {token ? (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#FFF4F4] border border-[#FFD6D6] p-4 md:p-5">
              <p className="text-[#B42318] font-semibold mb-2">
                {t('delete_account_warning_title')}
              </p>
              <p className="text-[#646465] text-sm md:text-base leading-relaxed">
                {t('delete_account_warning_body')}
              </p>
            </div>

            {!confirmOpen ? (
              <Button
                type="button"
                className="w-full md:w-auto bg-[#D92D20] hover:bg-[#B42318] text-white rounded-xl px-6 py-6"
                onClick={() => setConfirmOpen(true)}
              >
                {t('delete_account_button')}
              </Button>
            ) : (
              <div className="space-y-4 rounded-2xl border border-[#EDEEF1] p-4 bg-[#FAFBFC]">
                <p className="text-[#212122] font-medium">
                  {t('delete_account_confirm_question')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    disabled={isPending}
                    className="bg-[#D92D20] hover:bg-[#B42318] text-white rounded-xl px-6 py-6"
                    onClick={() => mutate()}
                  >
                    {isPending ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      t('delete_account_confirm_yes')
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className="rounded-xl px-6 py-6"
                    onClick={() => setConfirmOpen(false)}
                  >
                    {t('delete_account_confirm_no')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-[#646465] text-base leading-relaxed">
              {t('delete_account_guest_intro')}
            </p>

            <ol className="list-decimal pl-5 space-y-3 text-[#212122] text-base leading-relaxed">
              <li>{t('delete_account_guest_step_1')}</li>
              <li>{t('delete_account_guest_step_2')}</li>
            </ol>

            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl bg-[#084FE3] hover:bg-[#063EB8] text-white px-6 py-3 text-sm font-semibold transition-colors"
              >
                {t('Войти')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
