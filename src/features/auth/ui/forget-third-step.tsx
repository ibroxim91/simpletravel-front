'use client';

import { useRouter } from '@/shared/config/i18n/navigation';
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
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

const ForgetThirdStep = () => {
  const t = useTranslations();
  const { phone, email, token } = useLoginPhoneStore();
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) => {
      return Auth_Api.resetPass({
        password,
        token: token,
      });
    },
    onSuccess() {
      route.push('/auth/login');
      toast.success('Parol muvaffaqiyatli tiklandi');
    },
  });

  const { mutate: emailMutate, isPending: emailPending } = useMutation({
    mutationFn: ({ password, token }: { password: string; token: string }) => {
      return Auth_Api.resetPassEmail({
        password,
        token: token,
      });
    },
    onSuccess() {
      route.push('/profile?tabs=profile');
      toast.success('Parol muvaffaqiyatli tiklandi');
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (phone !== undefined) {
      mutate({
        password: values.password,
        token: token,
      });
    } else if (email !== undefined) {
      emailMutate({
        password: values.password,
        token: token,
      });
    }
  }

  return (
    <div className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2">
      <p className="text-xl font-semibold text-[#212122]">
        {t('Изменить пароль')}
      </p>
      <p className="mt-2 text-md w-full break-words text-[#646465]">
        {t('Измените пароль, чтобы обеспечить безопасность вашего аккаунта')}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="text-lg font-semibold text-[#212122]">
                  {t('Новый пароль')}
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
          <Button
            type="submit"
            disabled={emailPending || isPending}
            className="w-full px-4 py-8 rounded-full bg-[#1764FC] hover:bg-[#1764FC0] cursor-pointer"
          >
            {emailPending || isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              t('Сохранить новый пароль')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgetThirdStep;
