'use client';

import { Link } from '@/shared/config/i18n/navigation';
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
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Auth_Api } from '../lib/api';
import { useLoginPhoneStore } from '../lib/store';

interface Props {
  setStep: Dispatch<SetStateAction<number>>;
}

const OneStep = ({ setStep }: Props) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const { setEmail, setPhone } = useLoginPhoneStore();
  const phoneFormSchema = z.object({
    phone: z.string().min(17, { message: 'Введите корректный номер телефона' }),
  });

  const emailFormSchema = z.object({
    email: z.string().min(1, 'Majburiy maydon'),
  });

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: '',
    },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: phoneMutate, isPending } = useMutation({
    mutationFn: ({ phone }: { phone: string }) => {
      return Auth_Api.registerPhone({ phone });
    },
    onSuccess() {
      setStep(2);
    },
    onError(error: AxiosError<{ data: { detail: string; phone: [string] } }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description:
          error.response?.data.data.detail ||
          error.response?.data.data.phone[0],
        position: 'bottom-right',
      });
    },
  });

  const { mutate: emailMutate, isPending: emailPending } = useMutation({
    mutationFn: ({ email }: { email: string }) => {
      return Auth_Api.registerEmail({ email });
    },
    onSuccess() {
      setStep(2);
    },
    onError(error: AxiosError<{ data: { email: string } }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.data.email,
        position: 'bottom-right',
      });
    },
  });

  function onSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    setEmail(values.email);
    emailMutate({
      email: values.email,
    });
  }

  function onSubmitPhone(values: z.infer<typeof phoneFormSchema>) {
    setPhone(onlyNumber(values.phone));
    phoneMutate({
      phone: onlyNumber(values.phone),
    });
  }
  return (
    <Tabs
      defaultValue="phone"
      className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2"
    >
      <p className="text-xl font-semibold text-[#212122]">
        {t("Ro'yxatdan o'tish")}
      </p>
      <TabsList className="mt-2 w-full !bg-white h-[50px] !p-0.5 border-2 rounded-xl">
        <TabsTrigger
          value="phone"
          className="font-medium text-md data-[state=active]:bg-[#EDEEF1] cursor-pointer !shadow-none rounded-lg text-[#212122]"
        >
          {t('Hомер телефона')}
        </TabsTrigger>
        <TabsTrigger
          value="email"
          className="font-medium text-md cursor-pointer data-[state=active]:bg-[#EDEEF1] !shadow-none rounded-lg text-[#212122]"
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
                      className="h-[60px] !text-lg rounded-xl text-[#212122] placeholder:text-[#646465]"
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
                t('Получить код')
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
                      className="h-[60px] !text-lg rounded-xl text-[#212122] placeholder:text-[#646465]"
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
                t('Получить код')
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>
      <p className="mt-5 text-center text-[#646465] font-medium text-md">
        {t('Hisobingiz bormi')}{' '}
        <Link
          href={`/auth/login?callbackUrl=${callbackUrl}`}
          className="text-[#084FE3] "
        >
          {t('Kirish')}
        </Link>
      </p>
    </Tabs>
  );
};

export default OneStep;
