'use client';

import { User_Api } from '@/features/profile/lib/api';
import formatDate from '@/shared/lib/formatDate';
import formatPhone from '@/shared/lib/formatPhone';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Drawer from '@mui/material/Drawer';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus, TrashIcon, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { ParticipantsForm } from '../lib/form';
import formStore from '../lib/hook';

type PassportType = File | { id: number; image: string };

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

export default function ParticipantsStep({ onNext, onPrev }: Props) {
  const t = useTranslations();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openCalendar, setOpenCalendar] = useState<Record<number, boolean>>({});
  const [openWhereMobile, setOpenWhereMobile] = useState(false);
  const [previewFile, setPreviewFile] = useState<PassportType | null>(null);
  const { addUser, user } = formStore();
  const [userIds, setUserIds] = useState<(number | undefined)[]>([]);

  const {
    data: allParticipant,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['participant_all'],
    queryFn: ({ pageParam = 1 }) =>
      User_Api.getAllParticipant({
        page: pageParam,
        page_size: 5,
      }),
    getNextPageParam: (lastPage) => {
      const { links, current_page, total_pages } = lastPage.data.data;
      if (links.next && current_page < total_pages) {
        return current_page + 1;
      }
      return undefined;
    },

    initialPageParam: 1,
  });

  const form = useForm<z.infer<typeof ParticipantsForm>>({
    resolver: zodResolver(ParticipantsForm),
    defaultValues: {
      participants: user.length
        ? user.map((u) => ({
            gender: u.gender,
            firstName: u.firstName,
            lastName: u.lastName,
            date: u.birthDate,
            phone: u.phone,
            passport: u.passport,
          }))
        : [
            {
              gender: 'male',
              firstName: '',
              lastName: '',
              date: null,
              phone: '',
              passport: null,
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'participants',
  });
  const queryClient = useQueryClient();

  async function onSubmit(values: z.infer<typeof ParticipantsForm>) {
    const createPromises = [];

    for (let index = 0; index < values.participants.length; index++) {
      const participant = values.participants[index];
      const selectedUserId = userIds[index];

      if (selectedUserId) {
        addUser({
          userId: selectedUserId,
          birthDate: new Date(participant.date!),
          firstName: participant.firstName,
          gender: participant.gender,
          lastName: participant.lastName,
          passport: participant.passport,
          phone: participant.phone,
        });
        continue;
      }
      const formData = new FormData();
      formData.append('gender', participant.gender);
      formData.append('first_name', participant.firstName);
      formData.append('last_name', participant.lastName);
      formData.append('phone_number', participant.phone);
      formData.append(
        'birth_date',
        formatDate.format(participant.date!, 'YYYY-MM-DD') || '',
      );

      if (participant.passport) {
        const files = Array.isArray(participant.passport)
          ? participant.passport
          : [participant.passport];
        files.forEach((file) => {
          if (file instanceof File) {
            formData.append('pasport_images', file);
          }
        });
      }

      const promise = User_Api.createParticipant(formData).then((res) => {
        const newUser = res.data.data;
        addUser({
          userId: newUser.id,
          birthDate: new Date(newUser.birth_date),
          firstName: newUser.first_name,
          gender: newUser.gender,
          lastName: newUser.last_name,
          passport: newUser.participant_pasport_image,
          phone: newUser.phone_number,
        });
      });

      createPromises.push(promise);
    }

    try {
      if (createPromises.length > 0) {
        await Promise.all(createPromises);
      }

      toast.success(t('Hamroh(lar) muvaffaqiyatli saqlandi'));
      queryClient.refetchQueries({ queryKey: ['participant_all'] });
      onNext();
    } catch {
      toast.error(t('Xatolik yuz berdi'));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => {
          const dateValue = form.watch(`participants.${index}.date`);
          const passportValue = form.watch(`participants.${index}.passport`);

          return (
            <div
              key={field.id}
              className="bg-white p-5 rounded-2xl relative space-y-6"
            >
              <div className="w-full flex justify-end">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      setUserIds((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="flex gap-4 text-white bg-red-500 px-5 py-3 rounded-3xl"
                  >
                    <TrashIcon />
                    <p>{t('Удалить')}</p>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start max-lg:gap-4">
                <h1 className="font-bold text-xl text-[#212122]">
                  {t('Участник')} {index + 1}
                </h1>
                <Select
                  value={userIds[index]?.toString() ?? ''}
                  onValueChange={(value) => {
                    const selectedId = Number(value);

                    // ✅ userId holatini saqlaymiz
                    setUserIds((prev) => {
                      const updated = [...prev];
                      updated[index] = selectedId;
                      return updated;
                    });

                    // ✅ Foydalanuvchini olib kelamiz
                    User_Api.getOneParticipant({ id: selectedId }).then(
                      (res) => {
                        const p = res.data;
                        form.setValue(
                          `participants.${index}.gender`,
                          p.data.gender,
                        );
                        form.setValue(
                          `participants.${index}.firstName`,
                          p.data.first_name,
                        );
                        form.setValue(
                          `participants.${index}.lastName`,
                          p.data.last_name,
                        );
                        form.setValue(
                          `participants.${index}.date`,
                          new Date(p.data.birth_date),
                        );
                        form.setValue(
                          `participants.${index}.phone`,
                          formatPhone(p.data.phone_number),
                        );
                        form.setValue(
                          `participants.${index}.passport`,
                          p.data.participant_pasport_image,
                        );
                      },
                    );
                  }}
                >
                  <SelectTrigger className="w-60 max-lg:w-full">
                    <SelectValue
                      className="text-[#909091]"
                      placeholder={t('Сохранённые попутчики')}
                    />
                    <KeyboardArrowDownIcon />
                  </SelectTrigger>

                  <SelectContent
                    onScroll={(e) => {
                      const bottom =
                        e.currentTarget.scrollTop +
                          e.currentTarget.clientHeight >=
                        e.currentTarget.scrollHeight - 50;
                      if (bottom && hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                      }
                    }}
                    className="!max-h-[150px] !overflow-y-auto"
                  >
                    {allParticipant?.pages.some(
                      (page) => page.data.data.results.length > 0,
                    ) ? (
                      allParticipant.pages.map((page) =>
                        page.data.data.results.map((p) => (
                          <SelectItem key={p.id} value={`${p.id}`}>
                            {p.first_name} {p.last_name}
                          </SelectItem>
                        )),
                      )
                    ) : (
                      <div className="text-center text-[#909091] p-3">
                        {t('Нет сохранённых участников')}
                      </div>
                    )}

                    {isFetchingNextPage && (
                      <div className="text-center p-2 text-[#909091] text-sm">
                        {t('Загрузка...')}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <FormField
                control={form.control}
                name={`participants.${index}.gender`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="!text-[#121212] text-lg">
                      {t('Пол')}
                    </Label>
                    <FormControl>
                      <div className="flex items-center gap-8 mt-2 max-sm:flex-col max-sm:items-start">
                        <label className="flex items-center gap-2 cursor-pointer text-[#646465]">
                          <Input
                            type="radio"
                            value="male"
                            checked={field.value === 'male'}
                            onChange={field.onChange}
                            className="w-6 h-6 accent-[#084FE3]"
                          />
                          {t('Мужчина')}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-[#646465]">
                          <Input
                            type="radio"
                            value="female"
                            checked={field.value === 'female'}
                            onChange={field.onChange}
                            className="w-6 h-6 accent-[#084FE3]"
                          />
                          {t('Женщина')}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4 items-start max-lg:grid-cols-1">
                <FormField
                  control={form.control}
                  name={`participants.${index}.firstName`}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-lg text-[#121212] font-semibold">
                        {t('Имя')}
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t('Введите имя')}
                          className="px-5 h-14 rounded-lg placeholder:text-[#A3A3A3]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.lastName`}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-lg font-semibold text-[#121212]">
                        {t('Фамилия')}
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t('Введите фамилию')}
                          className="p-5 rounded-lg h-14 placeholder:text-[#A3A3A3]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 items-start max-lg:grid-cols-1">
                <FormField
                  control={form.control}
                  name={`participants.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-lg font-semibold text-[#121212]">
                        {t('Дата рождения')}
                      </Label>
                      <FormControl>
                        <div>
                          <div className="max-lg:hidden">
                            <Popover
                              open={!!openCalendar[index]}
                              onOpenChange={(isOpen) =>
                                setOpenCalendar((prev) => ({
                                  ...prev,
                                  [index]: isOpen,
                                }))
                              }
                            >
                              <PopoverTrigger asChild>
                                <button
                                  className={cn(
                                    'w-full justify-start text-left cursor-pointer relative font-normal border-2 h-full border-[#EDEEF1] rounded-md p-[12px]',
                                    !field.value && 'text-[#A3A3A3]',
                                  )}
                                >
                                  <CalendarMonthIcon
                                    sx={{
                                      width: '28px',
                                      height: '28px',
                                      position: 'absolute',
                                      right: 10,
                                      color: '#121212',
                                    }}
                                  />
                                  {field.value
                                    ? format(field.value, 'dd.MM.yyyy')
                                    : t('Дата рождения')}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={dateValue ? dateValue : undefined}
                                  onSelect={(d) => {
                                    field.onChange(d);
                                    setOpenCalendar((prev) => ({
                                      ...prev,
                                      [index]: false,
                                    }));
                                  }}
                                  captionLayout="dropdown"
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="lg:hidden">
                            <button
                              className={cn(
                                'w-full justify-start text-left cursor-pointer relative font-normal border-2 h-[56px] border-[#EDEEF1] rounded-md p-[12px]',
                                !field.value && 'text-muted-foreground',
                              )}
                              onClick={() => setOpenWhereMobile(true)}
                            >
                              <CalendarMonthIcon
                                sx={{
                                  width: '28px',
                                  height: '28px',
                                  position: 'absolute',
                                  right: 10,
                                }}
                              />
                              {field.value
                                ? format(field.value, 'dd.MM.yyyy')
                                : t('Когда')}
                            </button>
                            <Drawer
                              anchor="bottom"
                              open={openWhereMobile}
                              onClose={() => setOpenWhereMobile(false)}
                              PaperProps={{
                                sx: {
                                  borderTopLeftRadius: 16,
                                  borderTopRightRadius: 16,
                                  padding: 2,
                                  width: '100vw',
                                  maxHeight: '85vh',
                                  overflow: 'auto',
                                },
                              }}
                            >
                              <div className="flex flex-col gap-4 w-full font-medium">
                                <div className="flex items-center justify-between">
                                  <p className="text-lg font-semibold">
                                    {t('Дата отправления')}
                                  </p>
                                  <Button
                                    variant={'outline'}
                                    className="rounded-full h-[40px] w-[40px] cursor-pointer"
                                    onClick={() => setOpenWhereMobile(false)}
                                  >
                                    <CloseIcon sx={{ color: 'black' }} />
                                  </Button>
                                </div>
                                <Calendar
                                  className="w-full max-w-2xl mx-auto"
                                  mode="single"
                                  selected={dateValue ? dateValue : undefined}
                                  onSelect={(d) => {
                                    field.onChange(d);
                                    setOpenWhereMobile(false);
                                  }}
                                  disabled={{ before: new Date() }}
                                  captionLayout="dropdown"
                                />
                              </div>
                            </Drawer>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`participants.${index}.phone`}
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-lg font-semibold text-[#121212]">
                        {t('Телефон номер')}
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t('Введите номер')}
                          className="p-5 rounded-lg h-14"
                          value={field.value || '+998'}
                          onChange={(e) =>
                            field.onChange(formatPhone(e.target.value))
                          }
                          maxLength={19}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`participants.${index}.passport`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-xl font-semibold text-[#212122]">
                      {t('Фото/скан паспорта')}
                    </Label>
                    <FormControl>
                      <Input
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const current = form.getValues(
                              `participants.${index}.passport`,
                            );
                            const updated = Array.isArray(current)
                              ? [...current, file]
                              : [file];
                            field.onChange(updated);
                          }
                        }}
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                        id={`passport-file-${index}`}
                      />
                    </FormControl>
                    <label
                      htmlFor={`passport-file-${index}`}
                      className="w-full bg-[#EDEEF180] border-2 border-dashed border-[#D3D3D3] flex flex-col items-center gap-2 justify-center py-4 rounded-2xl cursor-pointer hover:bg-[#EDEEF1]"
                    >
                      <p className="font-semibold text-xl text-[#212122]">
                        {t('Drag or select file')}
                      </p>
                      <p className="text-[#646465] text-sm text-center">
                        {t('Drop files here or click to')}{' '}
                        <span className="underline text-[#084FE3]">
                          {t('browse')}
                        </span>{' '}
                        {t('through your machine')}
                      </p>
                    </label>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {passportValue && passportValue.length > 0 && (
                <div className="w-full flex flex-col gap-2 mt-4">
                  {passportValue.map((file: PassportType, imgIndex: number) => (
                    <div
                      key={imgIndex}
                      className="w-full flex items-center justify-between p-3 border-2 border-[#EDEEF1] rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-[50px] h-[50px]">
                          <Image
                            src={
                              file instanceof File
                                ? URL.createObjectURL(file)
                                : typeof file === 'string'
                                  ? file
                                  : file.image
                            }
                            alt="passport"
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>
                        <div>
                          <h1 className="font-bold text-sm truncate max-w-[150px]">
                            {'name' in file ? file.name : 'Image'}
                          </h1>
                          <p className="text-xs text-[#718096]">
                            {'size' in file
                              ? (file.size / 1024).toFixed(1) + 'KB'
                              : 'Image'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          disabled={!(file instanceof File)}
                          onClick={() => {
                            if (!passportValue) return;

                            const newFiles = Array.isArray(passportValue)
                              ? [...passportValue]
                              : [];

                            newFiles.splice(imgIndex, 1);

                            form.setValue(
                              `participants.${index}.passport`,
                              newFiles.length ? newFiles : null,
                            );

                            form.trigger(`participants.${index}.passport`);
                          }}
                        >
                          <TrashIcon />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => {
                            setPreviewFile(file);
                            setPreviewOpen(true);
                          }}
                        >
                          <UserIcon />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="flex gap-4 justify-between max-lg:flex-col-reverse">
          <button
            type="button"
            onClick={onPrev}
            className="bg-gray-200 border shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 px-10 py-4 rounded-full cursor-pointer"
          >
            {t('Назад')}
          </button>
          <div className="flex gap-4 max-lg:flex-col">
            <button
              type="button"
              onClick={() => {
                append({
                  gender: 'male',
                  firstName: '',
                  lastName: '',
                  phone: '',
                  date: null,
                  passport: null,
                });
                setUserIds((prev) => [...prev, undefined]);
              }}
              className="flex items-center gap-2 bg-white text-[#031753] border border-[#DFDFDF] px-6 py-3 rounded-full cursor-pointer"
            >
              <Plus /> {t('Новый участник')}
            </button>
            <button
              type="submit"
              className="bg-[#1764FC] text-white px-14 py-4 rounded-full cursor-pointer"
            >
              {t('Следующий')}
            </button>
          </div>
        </div>
      </form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          {previewFile && (
            <Image
              src={
                previewFile instanceof File
                  ? URL.createObjectURL(previewFile)
                  : typeof previewFile === 'string'
                    ? previewFile
                    : previewFile.image
              }
              alt="passport-preview"
              width={800}
              height={600}
              className="object-contain w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Form>
  );
}
