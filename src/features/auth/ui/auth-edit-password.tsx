'use client';

import Banner from '@/assets/Auth_Banner.png';
import { useWelcomeStore } from '@/features/profile/lib/hook';
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
  const route = useRouter();
  const { setOpenModalMobile, setOpenModal } = useWelcomeStore();
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
    setOpenModalMobile(true);
    setOpenModal(true);
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
        <p className="text-xl font-semibold">Изменить пароль</p>
        <p className="mt-2 text-md w-full break-words text-[#646465]">
          Измените пароль, чтобы обеспечить безопасность вашего аккаунта
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
                    Текущий пароль
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="Введите старый пароль"
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
                  <Label className="text-lg font-semibold">Новый пароль</Label>
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
            <Link
              href={'/auth/forget-password'}
              className="text-[#084FE3] font-medium"
            >
              Забыл пароль
            </Link>
            <Button
              type="submit"
              className="w-full px-4 py-8 rounded-full mt-3 bg-[#1764FC] hover:bg-[#1764FC0] cursor-pointer"
            >
              Сохранить новый пароль
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthEditPassword;
