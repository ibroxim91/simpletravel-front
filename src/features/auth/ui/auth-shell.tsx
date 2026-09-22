'use client';

import Banner from '@/assets/Auth_Banner.png';
import { usePathname, useRouter } from '@/shared/config/i18n/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AuthLoginForm from './auth-login-form';
import AuthRegisterFlow from './auth-register-flow';

export type AuthMode = 'login' | 'register';

function resolveMode(
  pathname: string,
  tabParam: string | null,
): AuthMode {
  if (tabParam === 'login' || tabParam === 'register') return tabParam;
  if (pathname.includes('/auth/register')) return 'register';
  return 'login';
}

const AuthShell = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const tabParam = searchParams.get('tab');

  const [mode, setMode] = useState<AuthMode>(() =>
    resolveMode(pathname, tabParam),
  );
  const [registerStep, setRegisterStep] = useState(1);

  useEffect(() => {
    setMode(resolveMode(pathname, tabParam));
  }, [pathname, tabParam]);

  useEffect(() => {
    if (!pathname.includes('/auth/register')) return;
    const params = new URLSearchParams();
    if (callbackUrl && callbackUrl !== 'null') {
      params.set('callbackUrl', callbackUrl);
    }
    params.set('tab', 'register');
    router.replace(`/auth/login?${params.toString()}`);
  }, [pathname, callbackUrl, router]);

  const switchMode = useCallback(
    (next: AuthMode) => {
      setMode(next);
      if (next === 'login') {
        setRegisterStep(1);
      }
      const params = new URLSearchParams();
      if (callbackUrl && callbackUrl !== 'null') {
        params.set('callbackUrl', callbackUrl);
      }
      params.set('tab', next);
      router.replace(`/auth/login?${params.toString()}`);
    },
    [callbackUrl, router],
  );

  return (
    <div className="custom-container relative mt-2 min-h-[880px]">
      <Image
        src={Banner}
        alt="banner"
        width={1119}
        height={224}
        priority
        quality={100}
        className="h-[300px] w-full rounded-3xl object-center max-sm:h-[100px]"
      />

      <div className="absolute left-1/2 top-52 w-[50%] -translate-x-1/2 rounded-3xl bg-white px-10 py-5 max-md:px-3 max-lg:w-[90%] max-sm:top-16">
        <Tabs
          value={mode}
          onValueChange={(value) => switchMode(value as AuthMode)}
          className="w-full gap-0"
        >
          {registerStep === 1 ? (
            <TabsList className="mt-0 flex h-auto w-full gap-1 !rounded-full !bg-[#EDEEF1] !p-1 border-0">
              <TabsTrigger
                value="register"
                className="min-w-0 flex-1 whitespace-normal rounded-full px-3 py-3 text-center text-sm font-semibold leading-tight text-[#646465] !shadow-none data-[state=active]:bg-[#1764FC] data-[state=active]:text-white data-[state=active]:!shadow-none sm:text-base"
              >
                {t("Ro'yxatdan o'tish")}
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="min-w-0 flex-1 whitespace-normal rounded-full px-3 py-3 text-center text-sm font-semibold leading-tight text-[#646465] !shadow-none data-[state=active]:bg-[#1764FC] data-[state=active]:text-white data-[state=active]:!shadow-none sm:text-base"
              >
                {t('Kirish')}
              </TabsTrigger>
            </TabsList>
          ) : null}

          <TabsContent value="login" className="mt-4 outline-none">
            <AuthLoginForm />
          </TabsContent>

          <TabsContent value="register" className="mt-4 outline-none">
            <AuthRegisterFlow step={registerStep} setStep={setRegisterStep} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="absolute bottom-5 flex w-full justify-center text-[#212122] max-lg:bottom-20">
        <p>{t('2025 © Все права защищены')}</p>
      </div>
    </div>
  );
};

export default AuthShell;
