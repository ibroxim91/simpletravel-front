import Banner from '@/assets/Auth_Banner.png';
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
import { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Auth_Api } from '../lib/api';

const AuthLogin = () => {
  const t = useTranslations();
  const ref = useQueryClient();
  const route = useRouter();
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
      route.push('/profile');
      ref.clear();
    },
    onError(error: AxiosError<{ non_field_errors: [string] }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.non_field_errors[0],
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
      route.push('/profile');
      ref.clear();
    },
    onError(
      error: AxiosError<{
        non_field_errors: string[];
        data: { detail: string };
      }>,
    ) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description:
          error.response && error.response.data
            ? error.response?.data?.data?.detail ||
              error.response?.data?.non_field_errors?.[0]
            : t('Xatolik yuz berdi'),
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
    <div className="custom-container mt-2 relative">
      <Image
        src={Banner}
        alt="banner"
        width={1119}
        height={224}
        priority
        quality={100}
        className="object-center w-full h-[300px] max-sm:h-[100px] rounded-3xl"
      />
      <Tabs
        defaultValue="phone"
        className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2"
      >
        <p className="text-xl font-semibold">{t('Profilga kirish')}</p>
        <TabsList className="mt-2 w-full !bg-white h-[50px] !p-0.5 border-2 rounded-xl">
          <TabsTrigger
            value="phone"
            className="font-medium text-md data-[state=active]:bg-[#EDEEF1] cursor-pointer !shadow-none rounded-lg"
          >
            {t('Hомер телефона')}
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="font-medium text-md cursor-pointer data-[state=active]:bg-[#EDEEF1] !shadow-none rounded-lg"
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
                    <Label className="text-md font-semibold">
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
                        className="h-[60px] !text-lg rounded-xl"
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
                    <Label className="text-lg font-semibold">
                      {t('Parol')}
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
              <Button
                type="submit"
                disabled={isPending}
                className="w-full py-8 text-lg bg-[#1764FC] hover:bg-[#1764FC] rounded-full cursor-pointer"
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
                    <Label className="text-md font-semibold">
                      {t('E-mail')}
                    </Label>
                    <FormControl>
                      <Input
                        placeholder={t('Введите ваш E-mail')}
                        {...field}
                        className="h-[60px] !text-lg rounded-xl"
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
                    <Label className="text-lg font-semibold">
                      {t('Parol')}
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
              <Button
                type="submit"
                className="w-full py-8 text-lg bg-[#1764FC] hover:bg-[#1764FC] rounded-full cursor-pointer"
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
        <p className="mt-5 text-center text-[#646465] font-medium text-md">
          {t("Hisobingiz yo'qmi")}{' '}
          <Link href={'/auth/register/'} className="text-[#084FE3] ">
            {t("Ro'yxatdan o'tish")}
          </Link>
        </p>
      </Tabs>
    </div>
  );
};

export default AuthLogin;
