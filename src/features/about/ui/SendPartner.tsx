'use client';

import loaderAnimation from '@/assets/lottie/Travel.json';
import Partners_1 from '@/assets/partners_1.png';
import Partners_2 from '@/assets/partners_2.png';
import Partners_3 from '@/assets/partners_3.png';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Player } from '@lottiefiles/react-lottie-player';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Drawer from '@mui/material/Drawer';
import clsx from 'clsx';
import { easeOut, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import senPartners from '../lib/form';

const SendPartner = () => {
  const partners = [Partners_1, Partners_2, Partners_3];
  const [open, setOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const repeatedPartners = [...partners, ...partners, ...partners];
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<z.infer<typeof senPartners>>({
    resolver: zodResolver(senPartners),
    defaultValues: {
      name: '',
      phone: '',
      address: ' ',
      email: '',
      license: undefined,
      website: '',
    },
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardHeight = 160;
  const totalHeight = partners.length * cardHeight;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const MotionDiv = isMobile ? 'div' : motion.div;

  async function onSubmit() {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('ok');
        }, 2000);
      });
      setLoading(false);
      setSuccess(true);
    } catch {
      setLoading(false);
      setError('Произошла ошибка при отправке. Попробуйте ещё раз.');
    }
  }
  return (
    <>
      <MotionDiv
        className="mt-20 h-auto bg-[#EDEEF140] border border-[#EDEEF1] rounded-3xl shadow-md flex justify-center max-lg:justify-start"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <CardContent className="grid-cols-2 grid w-full h-full max-lg:grid-cols-1 mb-5">
          <MotionDiv
            className="w-full h-full flex flex-col gap-4 px-6 max-lg:px-0 justify-center mt-4"
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-3xl w-[80%] max-lg:w-full text-[#031753] font-semibold">
              Сотрудничаем с лидерами Узбекистана
            </p>
            <p className="text-[#636363] text-lg font-medium max-lg:w-full">
              Мы успешно работаем с крупнейшими компаниями Узбекистана,
              предлагая им надёжные решения и долгосрочное партнёрство.
            </p>
            <Dialog
              open={open}
              onOpenChange={(isOpen) => {
                if (!loading) {
                  setOpen(isOpen);
                  if (!isOpen) setSuccess(false);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="w-fit cursor-pointer mt-2 rounded-3xl py-6 px-6 text-md max-lg:hidden">
                  Стать партнёром
                </Button>
              </DialogTrigger>

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
                    {loading && <p className="text-3xl">Отправка...</p>}

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
                        <p className="text-3xl">Стать партнёром</p>
                        <DialogClose asChild>
                          <Button
                            variant={'outline'}
                            onClick={() => {
                              setSuccess(false);
                              setLoading(false);
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
                          Заявка успешно отправлено
                        </p>
                        <p className="text-[#646465] font-medium text-lg">
                          Эксперт свяжется с вами в ближайшее время по номеру +
                          {form.getValues('phone')} позвонив на него
                        </p>
                        <div className="mt-4">
                          <Button
                            variant={'default'}
                            className="rounded-3xl bg-[#1764FC] px-10 font-semibold cursor-pointer py-4 h-fit w-fit"
                            onClick={() => {
                              form.reset();
                              setSuccess(false);
                              setLoading(false);
                              setOpen(false);
                            }}
                          >
                            Хорошо
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
                            setOpen(false);
                            setError(null);
                          }}
                        >
                          Попробовать снова
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
                                  Название компании
                                </Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Введите название вашей компании"
                                    className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <Label className="text-xl font-semibold text-[#212122]">
                                  Адрес
                                </Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Город, улица, дом"
                                    className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="license"
                            render={({ field }) => (
                              <FormItem>
                                <Label className="text-xl font-semibold text-[#212122]">
                                  Свидетельств/Лицензияо
                                </Label>
                                <FormControl>
                                  <Input
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      field.onChange(file);
                                    }}
                                    onBlur={field.onBlur}
                                    type="file"
                                    className="hidden"
                                    id="license-file"
                                  />
                                </FormControl>
                                <label
                                  htmlFor="license-file"
                                  className="w-full bg-[#EDEEF180] border-2 border-dashed border-[#D3D3D3] flex flex-col items-center gap-2 justify-center py-4 rounded-2xl cursor-pointer hover:bg-[#EDEEF1]"
                                >
                                  <p className="font-semibold text-xl text-[#212122]">
                                    Drag or select file
                                  </p>
                                  <p className="text-[#646465] text-sm">
                                    Drop files here or click to browse
                                  </p>
                                  {field.value && (
                                    <p className="text-[#212122] mt-2 font-medium">
                                      Выбран файл: {field.value.name}
                                    </p>
                                  )}
                                </label>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-4 w-full items-start">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <Label className="text-xl font-semibold text-[#212122]">
                                    Электронная почта
                                  </Label>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="example@mail.com"
                                      className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
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
                                    Номер телефона
                                  </Label>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Введите ваш номер телефона"
                                      className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <Label className="text-xl font-semibold text-[#212122]">
                                  Instagram / Вебсайт
                                </Label>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="https://example.com"
                                    className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-4 items-center">
                            <Button
                              type="submit"
                              className="px-10 py-8 rounded-4xl text-lg font-medium cursor-pointer"
                            >
                              Отправить
                            </Button>
                            <p className="font-medium text-md text-[#646465]">
                              Я даю согласие на обработку персональных данных
                            </p>
                          </div>
                        </form>
                      </Form>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </MotionDiv>
          <MotionDiv
            className="w-full h-full grid grid-cols-2 px-6 justify-center max-lg:hidden"
            variants={containerVariants}
          >
            {[0, 1].map((col) => (
              <MotionDiv
                key={col}
                className="overflow-hidden h-[480px] flex justify-center"
                variants={fadeUpVariants}
              >
                <MotionDiv
                  animate={{
                    y: col === 0 ? [-0, -totalHeight] : [-totalHeight, 0],
                  }}
                  transition={{
                    duration: 10,
                    ease: 'linear',
                    repeat: Infinity,
                  }}
                  className="grid gap-4"
                >
                  {repeatedPartners.map((img, idx) => (
                    <MotionDiv key={idx} variants={fadeUpVariants}>
                      <Card className="border-none shadow-sm aspect-square w-52 flex justify-center rounded-4xl">
                        <CardContent>
                          <Image
                            src={img}
                            alt={`Partner_${idx}`}
                            className="w-full h-full object-contain"
                          />
                        </CardContent>
                      </Card>
                    </MotionDiv>
                  ))}
                </MotionDiv>
              </MotionDiv>
            ))}
          </MotionDiv>

          <div className="w-full overflow-hidden flex flex-col gap-4 px-4 lg:hidden mt-10">
            {[0, 1].map((row) => (
              <motion.div
                key={row}
                className="flex gap-4"
                animate={{
                  x:
                    row === 0
                      ? [-0, -repeatedPartners.length * 160]
                      : [-repeatedPartners.length * 160, -0],
                }}
                transition={{
                  duration: 20,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                {repeatedPartners.map((img, idx) => (
                  <motion.div
                    key={idx}
                    className="flex-shrink-0 w-52 h-52"
                    variants={fadeUpVariants}
                  >
                    <Card className="border-none shadow-sm aspect-square w-full h-full flex justify-center rounded-4xl">
                      <CardContent>
                        <Image
                          src={img}
                          alt={`Partner_${idx}`}
                          className="w-full h-full object-contain"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </div>
          <Button
            className="w-full cursor-pointer mt-10 rounded-3xl py-6 px-6 text-md lg:hidden"
            onClick={() => setOpenDrawer(true)}
          >
            Стать партнёром
          </Button>
        </CardContent>
      </MotionDiv>
      <Drawer
        anchor="bottom"
        open={openDrawer}
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
        {!success && !error && !loading && (
          <div className="flex justify-between items-center p-4">
            <p className="text-2xl font-semibold">Стать партнёром</p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setLoading(false);
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
                Заявка успешно отправлено
              </p>
              <p className="text-[#646465] font-medium text-md">
                Эксперт свяжется с вами в ближайшее время по номеру{' '}
                {form.getValues('phone')} позвонив на него
              </p>
              <Button
                variant={'default'}
                className="rounded-3xl bg-[#1764FC] absolute bottom-2 w-[90%] cursor-pointer py-4 h-fit"
                onClick={() => {
                  form.reset();
                  setSuccess(false);
                  setLoading(false);
                  setOpenDrawer(false);
                }}
              >
                Хорошо
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
                Произошла ошибка при отправке
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
                  setOpenDrawer(false);
                }}
              >
                Попробовать снова
              </Button>
            </div>
          )}
          {!loading && !success && !error && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full px-4 mb-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-xl font-semibold text-[#212122]">
                        Название компании
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Введите название вашей компании"
                          className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-xl font-semibold text-[#212122]">
                        Адрес
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Город, улица, дом"
                          className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="license"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-xl font-semibold text-[#212122]">
                        Свидетельств/Лицензияо
                      </Label>
                      <FormControl>
                        <Input
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                          onBlur={field.onBlur}
                          type="file"
                          className="hidden"
                          id="license-file"
                        />
                      </FormControl>
                      <label
                        htmlFor="license-file"
                        className="w-full bg-[#EDEEF180] border-2 border-dashed border-[#D3D3D3] flex flex-col items-center gap-2 justify-center py-4 rounded-2xl cursor-pointer hover:bg-[#EDEEF1]"
                      >
                        <p className="font-semibold text-xl text-[#212122]">
                          Drag or select file
                        </p>
                        <p className="text-[#646465] text-sm">
                          Drop files here or click to browse
                        </p>
                        {field.value && (
                          <p className="text-[#212122] mt-2 font-medium">
                            Выбран файл: {field.value.name}
                          </p>
                        )}
                      </label>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="text-xl font-semibold text-[#212122]">
                        Электронная почта
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="example@mail.com"
                          className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
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
                        Номер телефона
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Введите ваш номер телефона"
                          className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="text-xl font-semibold text-[#212122]">
                        Instagram / Вебсайт
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com"
                          className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-4 items-center">
                  <Button
                    type="submit"
                    className="px-10 py-8 rounded-4xl w-full text-lg font-medium cursor-pointer"
                  >
                    Отправить
                  </Button>
                  <p className="font-medium text-center text-md text-[#646465]">
                    Я даю согласие на обработку персональных данных
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

export default SendPartner;
