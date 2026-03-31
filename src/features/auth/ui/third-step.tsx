'use client';

import { useWelcomeStore } from '@/features/profile/lib/hook';
import { saveRefToken, saveToken } from '@/shared/config/api/saveToke';
import { useRouter } from '@/shared/config/i18n/navigation';
import onlyNumber from '@/shared/lib/onlyNember';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Check, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Auth_Api } from '../lib/api';
import { useLoginPhoneStore } from '../lib/store';

const formSchema = z
  .object({
    password: z.string().min(8, {
      message: "Eng kamida 8ta belgi bo'lishi kerak",
    }),
    confirmPassword: z.string().min(8, {
      message: 'Parolni tasdiqlang',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parol va tasdiqlash bir xil bo'lishi kerak",
    path: ['confirmPassword'],
  });

const ThirdStep = () => {
  const t = useTranslations();
  const ref = useQueryClient();
  const route = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { phone, email } = useLoginPhoneStore();
  const { setOpenModalMobile, setOpenModal } = useWelcomeStore();
  const [license, setLicense] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: setPasswordPhone, isPending } = useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) => {
      return Auth_Api.PasswordPhone({ phone, password });
    },
    onSuccess(data) {
      saveToken(data.data.data.token.access);
      saveRefToken(data.data.data.token.refresh);
      if (callbackUrl && callbackUrl !== 'null') {
        route.push(callbackUrl);
      } else {
        route.push('/profile');
      }
      ref.clear();
      setOpenModalMobile(true);
      setOpenModal(true);
    },
    onError(error: AxiosError<{ data: { detail: string } }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.data.detail,
        position: 'bottom-right',
      });
    },
  });

  const { mutate: setPasswordEmail, isPending: emailPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return Auth_Api.PasswordEmail({ email, password });
    },
    onSuccess(data) {
      saveToken(data.data.data.token.access);
      saveRefToken(data.data.data.token.refresh);
      route.back();
      ref.clear();
      setOpenModalMobile(true);
      setOpenModal(true);
    },
    onError(error: AxiosError<{ data: { detail: string } }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.data.detail,
        position: 'bottom-right',
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (phone !== undefined) {
      setPasswordPhone({
        password: values.password,
        phone: onlyNumber(phone),
      });
    } else if (email !== undefined) {
      setPasswordEmail({
        password: values.password,
        email,
      });
    }
  }

  return (
    <div className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2">
      <p className="text-xl font-semibold text-[#212122]">
        {t('Регистрация аккаунта')}
      </p>
      <p className="mt-2 text-md w-full break-words text-[#646465]">
        {t('Создайте свой личный кабинет, чтобы управлять бронированиями')}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="text-lg font-semibold text-[#212122]">
                  {t('Придумайте пароль')}
                </Label>
                <FormControl>
                  <Input
                    placeholder={t('Введите пароль (минимум 8 символов)')}
                    {...field}
                    className="h-[60px] rounded-xl focus:!ring-0 !text-md text-[#212122] placeholder:text-[#646465]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label className="text-lg font-semibold text-[#212122]">
                  {t('Подтвердите пароль')}
                </Label>
                <FormControl>
                  <Input
                    placeholder={t('Повторите пароль')}
                    {...field}
                    className="h-[60px] rounded-xl focus:!ring-0 !text-md text-[#212122] placeholder:text-[#646465]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-3">
            <div
              className="border w-6 h-6 rounded-sm cursor-pointer flex justify-center items-center"
              onClick={() => setLicense((prev) => !prev)}
            >
              {license && <Check className="w-6 h-6" color="#1764FC" />}
            </div>
            <Label
              onClick={() => setLicense((prev) => !prev)}
              className="cursor-pointer text-[#646465]"
            >
              {t(
                'Я согласен с условиями использования и политикой конфиденциальности',
              )}
            </Label>
          </div>
          <Button
            type="submit"
            disabled={!license}
            className="w-full px-4 py-8 rounded-full bg-[#1764FC] hover:bg-[#1764FC0] cursor-pointer"
          >
            {isPending || emailPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              t('Зарегистрироваться')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ThirdStep;
