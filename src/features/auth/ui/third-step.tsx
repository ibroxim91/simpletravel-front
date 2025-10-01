'use client';

import { useWelcomeStore } from '@/features/profile/lib/hook';
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
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

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
  const route = useRouter();
  const { setOpenModalMobile, setOpenModal } = useWelcomeStore();
  const [license, setLicense] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit() {
    route.push('/profile');
    setOpenModalMobile(true);
    setOpenModal(true);
  }

  return (
    <div className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2">
      <p className="text-xl font-semibold">Регистрация аккаунта</p>
      <p className="mt-2 text-md w-full break-words text-[#646465]">
        Создайте свой личный кабинет, чтобы управлять бронированиями, сохранять
        избранное и пользоваться всеми возможностями Simple Travel
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label className="text-lg font-semibold">
                  Придумайте пароль
                </Label>
                <FormControl>
                  <Input
                    placeholder="Введите пароль (минимум 8 символов)"
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
                  Подтвердите пароль
                </Label>
                <FormControl>
                  <Input
                    placeholder="Повторите пароль"
                    {...field}
                    className="h-[60px] rounded-xl focus:!ring-0 !text-md"
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
              Я согласен с условиями использования и политикой
              конфиденциальности
            </Label>
          </div>
          <Button
            type="submit"
            disabled={!license}
            className="w-full px-4 py-8 rounded-full bg-[#1764FC] hover:bg-[#1764FC0] cursor-pointer"
          >
            Зарегистрироваться
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ThirdStep;
