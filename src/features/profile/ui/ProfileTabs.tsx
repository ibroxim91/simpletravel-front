'use client';

import { Auth_Api } from '@/features/auth/lib/api';
import SupportTabs from '@/features/faq/ui/SupportTabs';
import { removeRefToken, removeToken } from '@/shared/config/api/saveToke';
import { Link, useRouter } from '@/shared/config/i18n/navigation';
import formatPhone from '@/shared/lib/formatPhone';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
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
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EastIcon from '@mui/icons-material/East';
import EditIcon from '@mui/icons-material/Edit';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { LoaderCircle, LogOutIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { User_Api } from '../lib/api';
import { editUserEmail, editUserName, editUserPhone } from '../lib/form';
import ReservationsDeatilTabs from './ReservationsDeatilTabs';
import ReservationsTabs from './ReservationsTabs';
import SettingTabs from './SettingTabs';
import TravelersTabs from './TravelersTabs';

const ProfileTabs = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('profile');
  const [orderDetail, setOrderDetil] = useState<boolean>(false);
  const [orderDetailId, setOrderDetilId] = useState<number | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { data: user } = useQuery({
    queryKey: ['get_me'],
    queryFn: () => User_Api.getMe(),
  });
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
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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
    if (user && user.data.data.phone) {
      formPhone.reset({
        phone: formatPhone(user.data.data.phone),
      });
    }
  }, [formPhone, user]);

  useEffect(() => {
    if (user && user.data.data.email) {
      formEmail.reset({
        emial: user.data.data.email,
      });
    }
  }, [formEmail, user]);

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.data.data.first_name,
        lastName: user.data.data.last_name,
      });
    }
  }, [form, user]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      first_name,
      last_name,
      avatar,
    }: {
      first_name: string;
      last_name: string;
      avatar?: File;
    }) => {
      return Auth_Api.updateUser({ first_name, last_name, avatar });
    },
    onSuccess() {
      setEdit(false);
      setAvatarPreview(null);
      setAvatar(undefined);
      queryClient.clear();
    },
    onError(error: AxiosError<{ non_field_errors: [string] }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.name,
        position: 'bottom-right',
      });
    },
  });

  function updateAvatar() {
    if (avatar) {
      mutate({
        first_name: user ? user.data.data.first_name : '',
        last_name: user ? user.data.data.last_name : '',
        avatar,
      });
    }
  }

  function onSubmit(values: z.infer<typeof editUserName>) {
    mutate({
      first_name: values.firstName,
      last_name: values.lastName,
    });
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
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
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
        <div className="flex justify-between items-center">
          <p className="text-3xl text-[#031753] font-semibold">
            {t('Профиль')}
          </p>
          <button
            className="text-red-500 items-center flex gap-2 cursor-pointer font-medium lg:hidden"
            onClick={() => {
              removeToken();
              removeRefToken();
              queryClient.clear();
              router.push('/');
            }}
          >
            <LogOutIcon className="size-5" />
            <p>{t('Chiqish')}</p>
          </button>
        </div>
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
                className="!w-full !h-[50px] text-[#212122] py-4 data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Профиль')}
              </TabsTrigger>
              <TabsTrigger
                value="reservations"
                className="!w-full !h-[50px] py-4 text-[#212122] data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Мои бронирования')}
              </TabsTrigger>
              <TabsTrigger
                value="travelers"
                className="!w-full !h-[50px] py-4 text-[#212122] data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Мои попутчики')}
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="!w-full !h-[50px] py-4 text-[#212122] data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
              >
                {t('Настройки')}
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="!w-full !h-[50px] py-4 text-[#212122] data-[state=active]:bg-[#EDEEF1] cursor-pointer text-lg !items-start !justify-start px-4 rounded-xl !shadow-none"
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
                              <AvatarImage
                                src={
                                  avatarPreview
                                    ? avatarPreview
                                    : user?.data.data.avatar
                                      ? user.data.data.avatar
                                      : undefined
                                }
                                alt="User Avatar"
                              />
                              <AvatarFallback className="w-16 h-16 rounded-lg">
                                {user
                                  ? user.data.data.first_name
                                      .toUpperCase()
                                      .slice(0, 1) +
                                    user.data.data.last_name
                                      .toUpperCase()
                                      .slice(0, 1)
                                  : 'DB'}
                              </AvatarFallback>
                            </Avatar>

                            <p className="font-semibold text-lg text-[#050B08]">
                              {user
                                ? user?.data.data.first_name +
                                  ' ' +
                                  user?.data.data.last_name
                                : ''}
                            </p>
                          </div>
                          <div>
                            {avatar ? (
                              <div className="flex gap-2">
                                <Button
                                  variant={'secondary'}
                                  onClick={() => {
                                    setAvatar(undefined);
                                    setAvatarPreview(null);
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
                                  onClick={updateAvatar}
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
                                    <Label className="text-[#212122] text-lg">
                                      {t('Имя')}
                                    </Label>
                                    <FormControl>
                                      <Input
                                        disabled={!edit}
                                        placeholder={t('Введите имя')}
                                        className="h-14 rounded-2xl !text-md placeholder:text-[#646465]"
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
                                    <Label className="text-[#212122] text-lg">
                                      {t('Фамилия')}
                                    </Label>
                                    <FormControl>
                                      <Input
                                        disabled={!edit}
                                        placeholder={t('Введите фамилию')}
                                        className="h-14 !text-md rounded-2xl placeholder:text-[#646465]"
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
                                    className="h-12 rounded-3xl px-8 cursor-pointer text-md bg-[#084FE3] hover:bg-[#084FE3]"
                                    onClick={form.handleSubmit(onSubmit)}
                                  >
                                    {isPending ? (
                                      <LoaderCircle className="animate-spin" />
                                    ) : (
                                      t('Сохранить')
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  className="h-12 rounded-3xl px-8 cursor-pointer text-md max-lg:w-full bg-[#084FE3] hover:bg-[#084FE3"
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
                        <p className="text-xl font-semibold text-[#212122]">
                          {t('Контактные данные')}
                        </p>
                        <hr className="h-[2px] bg-[#DFDFDF]" />
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
                                    <Label className="text-lg font-semibold text-[#212122]">
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
                                        disabled
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
                                    <Label className="text-lg font-semibold text-[#212122]">
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
                                        disabled
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
                                      className="h-14 rounded-2xl !text-md placeholder:text-[#646465]"
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
                  key={
                    orderDetail ? `reservations-${orderDetail}` : 'reservations'
                  }
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                >
                  <TabsContent value="reservations">
                    {orderDetail ? (
                      <ReservationsDeatilTabs
                        id={orderDetailId}
                        setDetail={setOrderDetil}
                      />
                    ) : (
                      <ReservationsTabs
                        setDetail={setOrderDetil}
                        setOrderDetilId={setOrderDetilId}
                      />
                    )}
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
        <button
          className="text-red-500 items-center flex gap-2 cursor-pointer font-medium mt-10 max-lg:hidden"
          onClick={() => {
            removeToken();
            removeRefToken();
            queryClient.clear();
            router.push('/');
          }}
        >
          <LogOutIcon className="size-5" />
          <p>{t('Chiqish')}</p>
        </button>
      </div>
    </div>
  );
};

export default ProfileTabs;
