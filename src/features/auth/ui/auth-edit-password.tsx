'use client';

import Banner from '@/assets/Auth_Banner.png';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
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
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formSchema = z
  .object({
    oldPassword: z.string().min(8, {
      message: "Eng kamida 8ta belgi bo'lishi kerak",
    }),
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

const AuthEditPassword = () => {
  const t = useTranslations();
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      oldPassword: '',
    },
  });

  function onSubmit() {
    route.push('/profile');
  }
  return (
    <div className="custom-container mt-2 relative h-[700px]">
      <Image
        src={Banner}
        alt="banner"
        width={1119}
        height={224}
        priority
        quality={100}
        className="object-center w-full h-[300px] max-lg:h-[100px] rounded-3xl"
      />
      <div className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-48 max-md:px-2 max-lg:top-14 max-lg:w-[90%] left-1/2 -translate-x-1/2">
        <p className="text-xl font-semibold">{t('Изменить пароль')}</p>
        <p className="mt-2 text-md w-full break-words text-[#646465]">
          {t('Измените пароль, чтобы обеспечить безопасность вашего аккаунта')}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mt-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {t('Текущий пароль')}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t('Введите старый пароль')}
                      {...field}
                      className="h-[60px] rounded-xl focus:!ring-0 !text-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-lg font-semibold">
                    {t('Новый пароль')}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t('Введите пароль (минимум 8 символов)')}
                      {...field}
                      className="h-[60px] rounded-xl focus:!ring-0 !text-md"
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
                  <Label className="text-lg font-semibold">
                    {t('Подтвердите пароль')}
                  </Label>
                  <FormControl>
                    <Input
                      placeholder={t('Повторите пароль')}
                      {...field}
                      className="h-[60px] rounded-xl focus:!ring-0 !text-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href={'/auth/forget-password'}
              className="text-[#084FE3] font-medium"
            >
              {t('Забыл пароль')}
            </Link>
            <Button
              type="submit"
              className="w-full px-4 py-8 rounded-full mt-3 bg-[#1764FC] hover:bg-[#1764FC0] cursor-pointer"
            >
              {t('Сохранить новый пароль')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthEditPassword;
