'use client';

import { saveRefToken, saveToken } from '@/shared/config/api/saveToke';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import formatPhone from '@/shared/lib/formatPhone';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Auth_Api } from '../lib/api';
import { resolveAuthErrorMessage } from '@/shared/lib/extractApiErrorMessage';

const AuthLoginForm = () => {
  const t = useTranslations();
  const ref = useQueryClient();
  const route = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const phoneFormSchema = z.object({
    phone: z.string().min(17, { message: 'Введите корректный номер телефона' }),
    password: z
      .string()
      .min(8, { message: "Eng kamida 8ta belgi bo'lishi kerak" }),
  });

  const emailFormSchema = z.object({
    email: z.string().min(1, 'Majburiy maydon'),
    password: z
      .string()
      .min(8, { message: "Eng kamida 8ta belgi bo'lishi kerak" }),
  });

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: phoneMutate, isPending } = useMutation({
    mutationFn: ({ phone, password }: { phone: string; password: string }) => {
      return Auth_Api.loginPhone({ phone, password });
    },
    onSuccess(data) {
      saveToken(data.data.access);
      saveRefToken(data.data.refresh);
      ref.clear();

      if (callbackUrl && callbackUrl !== 'null') {
        route.push(callbackUrl);
      } else {
        route.push('/profile');
      }
    },
    onError(error) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: resolveAuthErrorMessage(error),
        position: 'bottom-right',
      });
    },
  });

  const { mutate: emailMutate, isPending: emailPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return Auth_Api.loginEmail({ email, password });
    },
    onSuccess(data) {
      saveToken(data.data.access);
      saveRefToken(data.data.refresh);
      ref.clear();
      if (callbackUrl && callbackUrl !== 'null') {
        route.push(callbackUrl);
      } else {
        route.push('/profile');
      }
    },
    onError(error) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: resolveAuthErrorMessage(error),
        position: 'bottom-right',
      });
    },
  });

  function onSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    emailMutate({
      email: values.email,
      password: values.password,
    });
  }

  function onSubmitPhone(values: z.infer<typeof phoneFormSchema>) {
    phoneMutate({
      phone: onlyNumber(values.phone),
      password: values.password,
    });
  }

  return (
    <Tabs defaultValue="phone" className="w-full gap-2">
      <p className="text-xl font-semibold text-[#212122]">
        {t('Profilga kirish')}
      </p>
      <TabsList className="mt-2 h-[50px] w-full !bg-white !p-0.5 border-2 rounded-xl">
        <TabsTrigger
          value="phone"
          className="cursor-pointer rounded-lg text-md font-medium text-[#212122] !shadow-none data-[state=active]:bg-[#EDEEF1]"
        >
          {t('Hомер телефона')}
        </TabsTrigger>
        <TabsTrigger
          value="email"
          className="cursor-pointer rounded-lg text-md font-medium text-[#212122] !shadow-none data-[state=active]:bg-[#EDEEF1]"
        >
          {t('Вход по E-mail')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="phone" className="mt-5">
        <Form {...phoneForm}>
          <form
            onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
            className="space-y-8"
          >
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-md font-semibold text-[#212122]">
                    {t('Hомер телефона')}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t('Введите номер телефона')}
                      {...field}
                      value={field.value || '+998'}
                      onChange={(e) =>
                        field.onChange(formatPhone(e.target.value))
                      }
                      maxLength={19}
                      className="h-[60px] rounded-xl !text-lg text-[#212122] placeholder:text-[#646465]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={phoneForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold text-[#212122]">
                    {t('Parol')}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t('Введите пароль (минимум 8 символов)')}
                      {...field}
                      className="h-[60px] rounded-xl !text-md text-[#212122] placeholder:text-[#646465] focus:!ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                  <Link
                    href={`/auth/forget-password?callbackUrl=${callbackUrl ?? ''}`}
                    className="text-end font-medium text-red-500"
                  >
                    {t('Parol esdan chiqdimi')}
                  </Link>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full cursor-pointer rounded-full bg-[#1764FC] py-8 text-lg hover:bg-[#1764FC]"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                t('Kirish')
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="email" className="mt-5">
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onSubmitEmail)}
            className="space-y-8"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-md font-semibold text-[#212122]">
                    {t('E-mail')}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t('Введите ваш E-mail')}
                      {...field}
                      className="h-[60px] rounded-xl !text-lg text-[#212122] placeholder:text-[#646465]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={emailForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold text-[#212122]">
                    {t('Parol')}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t('Введите пароль (минимум 8 символов)')}
                      {...field}
                      className="h-[60px] rounded-xl !text-md text-[#212122] placeholder:text-[#646465] focus:!ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                  <Link
                    href={`/auth/forget-password?callbackUrl=${callbackUrl ?? ''}`}
                    className="text-end font-medium text-red-500"
                  >
                    {t('Parol esdan chiqdimi')}
                  </Link>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full bg-[#1764FC] py-8 text-lg hover:bg-[#1764FC]"
            >
              {emailPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                t('Kirish')
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default AuthLoginForm;
