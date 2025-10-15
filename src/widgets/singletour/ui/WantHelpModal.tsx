'use client';

import loaderAnimation from '@/assets/lottie/Travel.json';
import formatPhone from '@/shared/lib/formatPhone';
import onlyNumber from '@/shared/lib/onlyNember';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Body, Support_Api } from '@/widgets/contacts/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Drawer from '@mui/material/Drawer';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import sendHelp from '../lib/form';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false },
);

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  openHelpMobile: boolean;
  id: string | undefined;
  setOpenHelpMobile: (openHelpMobile: boolean) => void;
}

const WantHelpModal = ({
  onClose,
  open,
  id,
  openHelpMobile,
  setOpenHelpMobile,
}: Props) => {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof sendHelp>>({
    resolver: zodResolver(sendHelp),
    defaultValues: {
      name: '',
      phone: '',
    },
  });
  const suffix = id?.replace('T-100', '');

  const { mutate, isPending } = useMutation({
    mutationFn: (body: Body) => {
      return Support_Api.send(body);
    },
    onSuccess() {
      setSuccess(true);
    },
    onError() {
      setError('Произошла ошибка при отправке');
    },
  });

  async function onSubmit(values: z.infer<typeof sendHelp>) {
    mutate({
      name: values.name,
      phone_number: onlyNumber(values.phone),
      travel_agency: suffix ? parseInt(suffix, 10) : '',
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!loading) {
            onClose(isOpen);
            if (!isOpen) setSuccess(false);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="rounded-4xl !max-w-4xl"
        >
          <DialogHeader>
            <DialogTitle
              className={clsx(
                'flex justify-between w-full items-center',
                error && 'justify-center',
                success && 'justify-center',
              )}
            >
              {loading && <p className="text-3xl">{t('Отправка')}...</p>}

              {success && (
                <Button
                  color="#38DA2A"
                  className="bg-[#38DA2A] h-14 w-14 mt-5 rounded-2xl hover:bg-[#38DA2A]"
                >
                  <DoneIcon sx={{ width: '38px', height: '38px' }} />
                </Button>
              )}

              {error && (
                <Button
                  color="#E03137"
                  className="bg-[#E03137] h-14 w-14 rounded-2xl hover:bg-[#E03137]"
                >
                  <CloseIcon sx={{ width: 32, height: 32 }} />
                </Button>
              )}

              {!loading && !success && !error && (
                <>
                  <p className="text-3xl text-[#121212]">
                    {t('Нужна помощь?')}
                  </p>
                  <DialogClose asChild>
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        setSuccess(false);
                        setLoading(false);
                        form.reset();
                      }}
                      className="rounded-full p-6 h-12 w-12 text-[#121212]"
                    >
                      <CloseIcon sx={{ width: 26, height: 26 }} />
                    </Button>
                  </DialogClose>
                </>
              )}
            </DialogTitle>

            <DialogDescription className="flex flex-col justify-center items-center gap-8">
              {loading && (
                <div className="flex justify-center items-center mt-10">
                  <Player
                    autoplay
                    loop
                    src={loaderAnimation}
                    style={{ height: '240px', width: '240px' }}
                  />
                </div>
              )}

              {success && (
                <div className="text-center flex flex-col gap-4 px-4 justify-center">
                  <p className="text-2xl mt-5 text-[#212122] font-semibold">
                    {t('Заявка успешно отправлено')}
                  </p>
                  <p className="text-[#646465] font-medium text-lg">
                    {t('Эксперт свяжется с вами в ближайшее время по номеру')} +
                    {form.getValues('phone')} {t('позвонив на него')}
                  </p>
                  <div className="mt-4">
                    <Button
                      variant={'default'}
                      className="rounded-3xl bg-[#1764FC] px-10 font-semibold cursor-pointer py-4 h-fit w-fit"
                      onClick={() => {
                        form.reset();
                        setSuccess(false);
                        setLoading(false);
                        onClose(false);
                      }}
                    >
                      {t('Хорошо')}
                    </Button>
                  </div>
                </div>
              )}

              {error && !loading && !success && (
                <div className="flex flex-col items-center text-center gap-6 mt-6">
                  <p className="text-xl font-semibold text-[#212122]">
                    {error}
                  </p>
                  <Button
                    variant="destructive"
                    className="rounded-3xl px-10 cursor-pointer py-4 h-fit w-fit font-semibold"
                    onClick={() => {
                      form.reset();
                      setSuccess(false);
                      setLoading(false);
                      onClose(false);
                      setError(null);
                    }}
                  >
                    {t('Попробовать снова')}
                  </Button>
                </div>
              )}

              {!loading && !success && !error && (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 w-full"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-xl font-semibold text-[#212122]">
                            {t('Имя')}
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t('Введите имя')}
                              className="h-[60px] px-4 font-medium !text-lg rounded-xl text-[#121212] placeholder:text-[#646465]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <Label className="text-xl font-semibold text-[#212122]">
                            {t('Номер телефона')}
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
                              className="h-[60px] px-4 font-medium !text-lg rounded-xl text-[#121212]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4 items-center">
                      <Button
                        type="submit"
                        className="px-14 py-8 rounded-4xl text-lg font-medium cursor-pointer bg-[#1764FC]"
                      >
                        {isPending ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          t('Отправить')
                        )}
                      </Button>
                      <p className="font-medium text-md text-[#646465]">
                        {t('Я даю согласие на обработку персональных данных')}
                      </p>
                    </div>
                  </form>
                </Form>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Drawer
        anchor="bottom"
        open={openHelpMobile}
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
        }}
        onClose={() => {
          if (!loading) {
            setSuccess(false);
            setLoading(false);
            setError(null);
            form.reset();
            setOpenHelpMobile(false);
          }
        }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: '100vw',
            height: '60vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {!success && !error && !loading && (
          <div className="flex justify-between items-center p-4">
            <p className="text-2xl font-semibold text-[#121212]">
              {t('Нужна помощь?')}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setLoading(false);
                setError(null);
                form.reset();
                setOpenHelpMobile(false);
              }}
              className="rounded-full h-12 w-12"
            >
              <CloseIcon sx={{ width: 26, height: 26, color: '#121212' }} />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <Player
                autoplay
                loop
                src={loaderAnimation}
                style={{ height: '240px', width: '240px' }}
              />
            </div>
          )}
          {success && !loading && (
            <div className="flex flex-col items-center justify-center gap-4 h-full px-4 text-center">
              <Button
                color="#38DA2A"
                className="bg-[#38DA2A] h-14 w-14 mt-5 rounded-2xl hover:bg-[#38DA2A]"
              >
                <DoneIcon sx={{ width: '38px', height: '38px' }} />
              </Button>
              <p className="text-2xl mt-5 text-[#212122]">
                {t('Заявка успешно отправлено')}
              </p>
              <p className="text-[#646465] font-medium text-md">
                {t('Эксперт свяжется с вами в ближайшее время по номеру')}{' '}
                {form.getValues('phone')} {t('позвонив на него')}
              </p>
              <Button
                variant={'default'}
                className="rounded-3xl bg-[#1764FC] absolute bottom-2 w-[90%] cursor-pointer py-4 h-fit"
                onClick={() => {
                  form.reset();
                  setSuccess(false);
                  setLoading(false);
                  setOpenHelpMobile(false);
                }}
              >
                {t('Хорошо')}
              </Button>
            </div>
          )}
          {error && !loading && !success && (
            <div className="flex flex-col items-center justify-center gap-4 h-full px-4 text-center">
              <Button
                color="#E03137"
                className="bg-[#E03137] h-14 w-14 rounded-2xl hover:bg-[#E03137]"
              >
                <CloseIcon sx={{ width: 32, height: 32 }} />
              </Button>
              <p className="text-2xl mt-5 text-[#212122]">
                {t('Произошла ошибка при отправке')}
              </p>
              <p className="text-xl font-semibold text-[#212122]">{error}</p>
              <Button
                variant="destructive"
                className="rounded-3xl px-10 absolute bottom-2 cursor-pointer py-4 h-fit w-[90%]"
                onClick={() => {
                  form.reset();
                  setSuccess(false);
                  setLoading(false);
                  setError(null);
                  setOpenHelpMobile(false);
                }}
              >
                {t('Попробовать снова')}
              </Button>
            </div>
          )}
          {!loading && !success && !error && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="h-full flex flex-col justify-between"
              >
                <div className="space-y-4 w-full px-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-xl font-semibold text-[#212122]">
                          {t('Имя')}
                        </Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('Введите название вашей компании')}
                            className="h-[60px] px-4 font-medium !text-lg rounded-xl text-[#121212] placeholder:text-[#A3A3A3]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Label className="text-xl font-semibold text-[#212122]">
                          {t('Номер телефона')}
                        </Label>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('Введите ваш номер телефона')}
                            className="h-[60px] px-4 font-medium !text-lg rounded-xl text-[#121212] placeholder:text-[#A3A3A3]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-4 items-center mb-4">
                  <Button
                    type="submit"
                    className="px-10 py-8 rounded-4xl w-full text-lg font-medium cursor-pointer bg-[#1764FC]"
                  >
                    {t('Отправить')}
                  </Button>
                  <p className="font-medium text-center text-md text-[#646465]">
                    {t('Я даю согласие на обработку персональных данных')}
                  </p>
                </div>
              </form>
            </Form>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default WantHelpModal;
