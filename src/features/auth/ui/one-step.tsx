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
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useLoginPhoneStore } from '../lib/store';

interface Props {
  setStep: Dispatch<SetStateAction<number>>;
}

const OneStep = ({ setStep }: Props) => {
  const t = useTranslations();
  const { setEmail, setPhone } = useLoginPhoneStore();
  const phoneFormSchema = z.object({
    phone: z
      .string()
      .regex(/^\+?\d{9,15}$/, 'Введите корректный номер телефона'),
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

  function onSubmitEmail(values: z.infer<typeof emailFormSchema>) {
    setEmail(values.email);
    setStep(2);
  }

  function onSubmitPhone(values: z.infer<typeof phoneFormSchema>) {
    setPhone(values.phone);
    setStep(2);
  }
  return (
    <Tabs
      defaultValue="phone"
      className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2"
    >
      <p className="text-xl font-semibold">{t('Вход в аккаунт')}</p>
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
                      className="h-[60px] !text-lg rounded-xl"
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
              {t('Получить код')}
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
                  <Label className="text-md font-semibold">{t('E-mail')}</Label>
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
            <Button
              type="submit"
              className="w-full py-8 text-lg bg-[#1764FC] hover:bg-[#1764FC] rounded-full cursor-pointer"
            >
              {t('Получить код')}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default OneStep;
