'use client';

import SupportTabs from '@/features/faq/ui/SupportTabs';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EastIcon from '@mui/icons-material/East';
import EditIcon from '@mui/icons-material/Edit';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { editUserEmail, editUserName, editUserPhone } from '../lib/form';
import ReservationsTabs from './ReservationsTabs';
import SettingTabs from './SettingTabs';
import TravelersTabs from './TravelersTabs';

const ProfileTabs = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const searchParams = useSearchParams();

  const variants = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0 },
  };

  const variantsTabs = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };
  const [edit, setEdit] = useState<boolean>(false);
  const [editPhoneState, setEditPhoneState] = useState<boolean>(false);
  const [editEmailState, setEditEmailState] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tabs');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof editUserName>>({
    resolver: zodResolver(editUserName),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  const formPhone = useForm<z.infer<typeof editUserPhone>>({
    resolver: zodResolver(editUserPhone),
    defaultValues: {
      phone: '',
    },
  });

  const formEmail = useForm<z.infer<typeof editUserEmail>>({
    resolver: zodResolver(editUserEmail),
    defaultValues: {
      emial: '',
    },
  });

  useEffect(() => {
    form.reset({
      firstName: 'Baxodir',
      lastName: 'Darobov',
    });
  }, [form]);

  function onSubmit() {
    setEdit(false);
  }

  function editPhone() {
    setEditPhoneState(false);
  }

  function editEmail() {
    setEditEmailState(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  return (
    <div className="custom-container mt-5">
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
        <p className="text-[#646465] font-medium">{t('Профиль')}</p>
      </Breadcrumbs>

      <div className="mt-10">
        <p className="text-3xl text-[#031753] font-semibold">{t('Профиль')}</p>
        <motion.div
          key="cabinet"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variantsTabs}
          transition={{ duration: 0.5 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val);
              router.push(`/profile?tabs=${val}`);
            }}
            defaultValue="profile"
            className="!w-full mt-5 !h-full !flex !flex-row gap-5 max-lg:!flex-col"
          >
            <TabsList className="!flex !flex-col w-[350px] bg-[#FFFFFF] px-2 h-full py-4 gap-3 rounded-3xl max-lg:w-full">
              <TabsTrigger
                value="profile"
                className="!w-full !h-[50px] py-4 data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Профиль')}
              </TabsTrigger>
              <TabsTrigger
                value="reservations"
                className="!w-full !h-[50px] py-4 data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Мои бронирования')}
              </TabsTrigger>
              <TabsTrigger
                value="travelers"
                className="!w-full !h-[50px] py-4 data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Мои попутчики')}
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="!w-full !h-[50px] py-4 data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Настройки')}
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="!w-full !h-[50px] py-4 data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Служба поддержки')}
              </TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  className="w-full"
                  transition={{ duration: 0.5 }}
                >
                  <TabsContent value="profile">
                    <div className="flex flex-col gap-4">
                      <div className="w-full bg-white rounded-2xl flex flex-col px-4 py-4 gap-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <Avatar className="w-16 h-16 rounded-lg">
                              <AvatarImage src={avatar} />
                              <AvatarFallback className="w-16 h-16 rounded-lg">
                                DB
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-semibold text-lg">
                              Darobov Baxodir
                            </p>
                          </div>
                          <div>
                            {avatar ? (
                              <div className="flex gap-2">
                                <Button
                                  variant={'secondary'}
                                  onClick={() => {
                                    setAvatar('');
                                  }}
                                  className="h-12 rounded-3xl border border-[#DFDFDF] px-8 cursor-pointer text-md"
                                >
                                  <CloseIcon fill="#031753" />
                                  <p className="text-md max-lg:hidden">
                                    {t('Отмена')}
                                  </p>
                                </Button>
                                <Button
                                  className="h-12 rounded-3xl px-8 cursor-pointer text-md"
                                  onClick={() => {
                                    setAvatar('');
                                  }}
                                >
                                  <DoneIcon fill="#031753" />
                                  <p className="text-md max-lg:hidden">
                                    {'Сохранить'}
                                  </p>
                                </Button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <Button
                                  variant={'outline'}
                                  className="text-[#031753] rounded-3xl !px-8 !py-6 max-lg:!px-3 max-lg:!rounded-full max-lg:!py-6 cursor-pointer border-2 border-[#DFDFDF] !shadow-none"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <EditIcon fill="#031753" />
                                  <p className="text-md max-lg:hidden">
                                    {t('Изменить аватар')}
                                  </p>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <hr className="h-[2px] bg-[#EDEEF1]" />

                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4"
                          >
                            <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1 items-start">
                              <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('Имя')}</FormLabel>
                                    <FormControl>
                                      <Input
                                        disabled={!edit}
                                        placeholder={t('Введите имя')}
                                        className="h-14 rounded-2xl !text-md"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{t('Фамилия')}</FormLabel>
                                    <FormControl>
                                      <Input
                                        disabled={!edit}
                                        placeholder={t('Введите фамилию')}
                                        className="h-14 !text-md rounded-2xl"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="w-full flex justify-end items-end max-lg:justify-start">
                              {edit ? (
                                <div className="flex gap-2 max-lg:flex-col max-lg:w-full">
                                  <Button
                                    variant={'secondary'}
                                    onClick={() => {
                                      setEdit(false);
                                      form.reset();
                                    }}
                                    className="h-12 rounded-3xl border border-[#DFDFDF] px-8 cursor-pointer text-md max-lg:w-full"
                                  >
                                    {t('Отмена')}
                                  </Button>
                                  <Button
                                    className="h-12 rounded-3xl px-8 cursor-pointer text-md"
                                    onClick={form.handleSubmit(onSubmit)}
                                  >
                                    {t('Сохранить')}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  className="h-12 rounded-3xl px-8 cursor-pointer text-md max-lg:w-full"
                                  onClick={() => setEdit(true)}
                                >
                                  {t('Изменение')}
                                </Button>
                              )}
                            </div>
                          </form>
                        </Form>
                      </div>
                      <div className="w-full bg-white rounded-2xl flex flex-col px-4 py-4 gap-4">
                        <p className="text-xl font-semibold">
                          {t('Контактные данные')}
                        </p>
                        <hr className="h-[2px] bg-[#EDEEF1]" />
                        <Form {...formPhone}>
                          <form
                            onSubmit={formPhone.handleSubmit(editPhone)}
                            className="space-y-4 mt-4"
                          >
                            <FormField
                              control={formPhone.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex justify-between w-full gap-1">
                                    <Label className="text-lg font-semibold">
                                      {t('Номер телефона')}
                                    </Label>
                                    {editPhoneState ? (
                                      <div className="flex max-lg:gap-2">
                                        <Button
                                          variant={'ghost'}
                                          onClick={() => {
                                            setEditPhoneState(false);
                                            formPhone.reset();
                                          }}
                                          className="rounded-3xl max-lg:!p-0 cursor-pointer text-md hover:bg-white text-[#646465] hover:text-[#646465] flex items-center"
                                        >
                                          <div className="lg:hidden border p-2 rounded-full flex justify-center ">
                                            <CloseIcon
                                              sx={{
                                                width: '20px',
                                                height: '20px',
                                              }}
                                            />
                                          </div>
                                          <p className="max-lg:hidden">
                                            {t('Отмена')}
                                          </p>
                                        </Button>
                                        <Button
                                          variant={'ghost'}
                                          className="text-[#084FE3] max-lg:!p-0 hover:bg-white hover:text-[#084FE3] cursor-pointer text-md font-semibold flex items-center"
                                          type="submit"
                                        >
                                          <div className="lg:hidden border p-2 rounded-full flex justify-center ">
                                            <DoneIcon
                                              sx={{
                                                width: '20px',
                                                height: '20px',
                                              }}
                                            />
                                          </div>
                                          <p className="max-lg:hidden">
                                            {t('Сохранить')}
                                          </p>
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant={'ghost'}
                                        className="text-[#084FE3] max-lg:!p-0 hover:bg-white hover:text-[#084FE3] cursor-pointer text-md font-semibold flex items-center"
                                        onClick={() => setEditPhoneState(true)}
                                      >
                                        <div className="lg:hidden border p-2 rounded-full flex justify-center">
                                          <EditIcon
                                            sx={{
                                              width: '20px',
                                              height: '20px',
                                            }}
                                          />
                                        </div>
                                        <p className="max-lg:hidden">
                                          {t('Изменение')}
                                        </p>
                                      </Button>
                                    )}
                                  </div>
                                  <FormControl>
                                    <Input
                                      disabled={!editPhoneState}
                                      placeholder={t('Введите номер телефона')}
                                      className="h-14 rounded-2xl !text-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </form>
                        </Form>
                        <Form {...formEmail}>
                          <form
                            onSubmit={formEmail.handleSubmit(editEmail)}
                            className="space-y-4 mt-4"
                          >
                            <FormField
                              control={formEmail.control}
                              name="emial"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex justify-between w-full gap-1">
                                    <Label className="text-lg font-semibold">
                                      {t('Электронная почта')}
                                    </Label>
                                    {editEmailState ? (
                                      <div className="flex max-lg:gap-2">
                                        <Button
                                          variant={'ghost'}
                                          onClick={() => {
                                            setEditEmailState(false);
                                            formEmail.reset();
                                          }}
                                          className="rounded-3xl max-lg:!p-0 cursor-pointer text-md hover:bg-white text-[#646465] hover:text-[#646465] flex items-center"
                                        >
                                          <div className="lg:hidden border p-2 rounded-full flex justify-center ">
                                            <CloseIcon
                                              sx={{
                                                width: '20px',
                                                height: '20px',
                                              }}
                                            />
                                          </div>
                                          <p className="max-lg:hidden">
                                            {t('Отмена')}
                                          </p>
                                        </Button>
                                        <Button
                                          variant={'ghost'}
                                          className="text-[#084FE3] max-lg:!p-0 hover:bg-white hover:text-[#084FE3] cursor-pointer text-md font-semibold flex items-center"
                                          type="submit"
                                        >
                                          <div className="lg:hidden border p-2 rounded-full flex justify-center ">
                                            <DoneIcon
                                              sx={{
                                                width: '20px',
                                                height: '20px',
                                              }}
                                            />
                                          </div>
                                          <p className="max-lg:hidden">
                                            {t('Сохранить')}
                                          </p>
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant={'ghost'}
                                        className="text-[#084FE3] max-lg:!p-0 hover:bg-white hover:text-[#084FE3] cursor-pointer text-md font-semibold flex items-center"
                                        onClick={() => setEditEmailState(true)}
                                      >
                                        <div className="lg:hidden border p-2 rounded-full flex justify-center">
                                          <EditIcon
                                            sx={{
                                              width: '20px',
                                              height: '20px',
                                            }}
                                          />
                                        </div>
                                        <p className="max-lg:hidden">
                                          {t('Изменение')}
                                        </p>
                                      </Button>
                                    )}
                                  </div>
                                  <FormControl>
                                    <Input
                                      disabled={!editEmailState}
                                      placeholder={t('Введите ваш E-mail')}
                                      className="h-14 rounded-2xl !text-md"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </form>
                        </Form>
                      </div>
                    </div>
                  </TabsContent>
                </motion.div>
              )}
              {activeTab === 'reservations' && (
                <motion.div
                  key="reservations"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <TabsContent value="reservations">
                    <ReservationsTabs />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === 'travelers' && (
                <TabsContent value="travelers">
                  <TravelersTabs />
                </TabsContent>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  className="w-full"
                  transition={{ duration: 0.5 }}
                >
                  <TabsContent value="settings">
                    <SettingTabs />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <TabsContent value="support">
                    <SupportTabs />
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileTabs;
