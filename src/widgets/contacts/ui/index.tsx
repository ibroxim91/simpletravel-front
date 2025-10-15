'use client';

import loaderAnimation from '@/assets/lottie/Travel.json';
import { Link } from '@/shared/config/i18n/navigation';
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
import { zodResolver } from '@hookform/resolvers/zod';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EastIcon from '@mui/icons-material/East';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Drawer from '@mui/material/Drawer';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Body, Support_Api } from '../lib/api';
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false },
);

export default function Contacts() {
  const t = useTranslations();
  const senPartners = z.object({
    name: z.string().min(2, {
      message: "Eng kamida 2ta harf bo'lishi kerak",
    }),
    phone: z.string().min(5, {
      message: 'Telefon raqam xato',
    }),
  });
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof senPartners>>({
    resolver: zodResolver(senPartners),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

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

  async function onSubmit(values: z.infer<typeof senPartners>) {
    setOpen(true);
    mutate({
      name: values.name,
      phone_number: onlyNumber(values.phone),
    });
  }

  async function onSubmitMobile(values: z.infer<typeof senPartners>) {
    setOpenDrawer(true);
    mutate({
      name: values.name,
      phone_number: onlyNumber(values.phone),
    });
  }

  // const MAP_EMBED_SRC =
  //   'https://maps.google.com/maps?q=Simple%20Travel%20Company&t=&z=13&ie=UTF8&iwloc=&output=embed';

  return (
    <div className="custom-container mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<EastIcon fontSize="small" className="text-[#646465]" />}
          sx={{
            '& .MuiBreadcrumbs-separator': {
              mx: 2,
            },
          }}
        >
          <Link href="/" className="font-medium text-[#646465]">
            {t('Главная')}
          </Link>
          <p className="text-[#646465] font-medium">{t('Контакты')}</p>
        </Breadcrumbs>
      </motion.div>

      <h1 className="font-bold text-[#031753] text-[32px] my-5">
        {t('Контакты')}
      </h1>

      <div className="grid grid-cols-2 gap-6 justify-between max-lg:grid-cols-1">
        <div className="h-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-[20px] bg-[#ffffff] rounded-[16px]">
              <p className="font-semibold text-[#121212] text-2xl mb-4">
                {t('Ответим на все вопросы')}
              </p>
              <Form {...form}>
                <form className="space-y-4 w-full">
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
                            placeholder={t('Введите Имя')}
                            className="h-[60px] px-4 font-medium !text-lg rounded-xl text-[#212122] placeholder:text-[#646465]"
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
                      <FormItem>
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
                            className="h-[60px] px-4 font-medium !text-lg rounded-xl text-[#212122] placeholder:text-[#646465]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4 items-center max-lg:flex-col">
                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      className="px-10 py-7 max-lg:hidden bg-[#1764FC] hover:bg-[#1764FC] max-lg:w-full rounded-4xl text-lg font-medium cursor-pointer"
                    >
                      {t('Отправить')}
                    </Button>
                    <Button
                      onClick={form.handleSubmit(onSubmitMobile)}
                      className="px-10 py-7 lg:hidden bg-[#1764FC] hover:bg-[#1764FC] max-lg:w-full rounded-4xl text-lg font-medium cursor-pointer"
                    >
                      {t('Отправить')}
                    </Button>
                    <p className="font-medium text-md text-[#646465]">
                      {t('Я даю согласие на обработку персональных данных')}
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#084FE3] p-[20px] rounded-3xl text-white mt-[15px]"
          >
            <h1 className="font-bold text-[32px] my-5">{t('Контакты')}</h1>

            <div className="flex items-center justify-between my-5 gap-4">
              <div className="flex items-center gap-2">
                <LocationOnIcon />
                {t('Адрес')}:
              </div>

              <p>{t('Алмазарский р-н, Камарнисо, 13')}</p>
            </div>
            <hr className="border-[#FFFFFF29]" />
            <div className="flex items-center justify-between my-5">
              <div className="flex items-center gap-2 ">
                <CallEndIcon />
                {t('Телефон')}:
              </div>
              <p>5990</p>
            </div>

            <div className="flex items-center gap-4 my-5 max-[400px]:flex-col max-[400px]:items-start">
              <div className="p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]">
                <LinkedInIcon />
              </div>
              <div className="p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]">
                <XIcon />
              </div>
              <div className="p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]">
                <InstagramIcon />
              </div>
              <div className="p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]">
                <FacebookIcon />
              </div>
              <div className="p-[10px] rounded-full border-2 cursor-pointer border-[#FFFFFF29]">
                <TelegramIcon />
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <YMaps query={{ lang: 'ru_RU' }}>
            <Map
              defaultState={{ center: [41.370693, 69.209772], zoom: 20 }}
              width="100%"
              height="100%"
            >
              <Placemark
                geometry={[41.370693, 69.209772]}
                options={{
                  iconLayout: 'default#image',
                  iconImageHref: '/LogoMark.png',
                  iconImageSize: [105, 70],
                  iconImageOffset: [-20, -20],
                }}
              />
            </Map>
          </YMaps>
        </motion.div>
      </div>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isPending) {
            setOpen(isOpen);
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
              {isPending && <p className="text-3xl">{t('Отправка')}...</p>}

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

              {!isPending && !success && !error && (
                <>
                  <p className="text-3xl">{t('Стать партнёром')}</p>
                  <DialogClose asChild>
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        setSuccess(false);
                        form.reset();
                      }}
                      className="rounded-full p-6 h-12 w-12"
                    >
                      <CloseIcon sx={{ width: 26, height: 26 }} />
                    </Button>
                  </DialogClose>
                </>
              )}
            </DialogTitle>

            <DialogDescription className="flex flex-col justify-center items-center gap-8">
              {isPending && (
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
                        setOpen(false);
                      }}
                    >
                      {t('Хорошо')}
                    </Button>
                  </div>
                </div>
              )}

              {error && !isPending && !success && (
                <div className="flex flex-col items-center text-center gap-6 mt-6">
                  <p className="text-xl font-semibold text-[#212122]">
                    {t(error)}
                  </p>
                  <Button
                    variant="destructive"
                    className="rounded-3xl px-10 cursor-pointer py-4 h-fit w-fit font-semibold"
                    onClick={() => {
                      form.reset();
                      setSuccess(false);
                      setOpen(false);
                      setError(null);
                    }}
                  >
                    {t('Попробовать снова')}
                  </Button>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Drawer
        anchor="bottom"
        open={openDrawer}
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
        }}
        onClose={() => {
          if (!isPending) {
            setSuccess(false);
            setError(null);
            form.reset();
            setOpenDrawer(false);
          }
        }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: '100vw',
            height: '95vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {!success && !error && !isPending && (
          <div className="flex justify-between items-center p-4">
            <p className="text-2xl font-semibold">{t('Стать партнёром')}</p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setError(null);
                form.reset();
                setOpenDrawer(false);
              }}
              className="rounded-full h-12 w-12"
            >
              <CloseIcon sx={{ width: 26, height: 26 }} />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {isPending && (
            <div className="flex justify-center items-center h-full">
              <Player
                autoplay
                loop
                src={loaderAnimation}
                style={{ height: '240px', width: '240px' }}
              />
            </div>
          )}
          {success && !isPending && (
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
                  setOpenDrawer(false);
                }}
              >
                {t('Хорошо')}
              </Button>
            </div>
          )}
          {error && !isPending && !success && (
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
                  setError(null);
                  setOpenDrawer(false);
                }}
              >
                {t('Попробовать снова')}
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
