'use client';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
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
import { format, parse } from 'date-fns';
import { Plus, TrashIcon, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';
import { participantsDate } from '../lib/data';
import { ParticipantsForm } from '../lib/form';
import formStore from '../lib/hook';

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

export default function ParticipantsStep({ onNext, onPrev }: Props) {
  const t = useTranslations();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openWhereMobile, setOpenWhereMobile] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const { addUser, user } = formStore();

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

  function onSubmit(values: z.infer<typeof ParticipantsForm>) {
    formStore.setState({ user: [] }); // avval user massivni tozalaymiz

    values.participants.forEach((p) => {
      addUser({
        birthDate: p.date ?? null,
        gender: p.gender,
        firstName: p.firstName,
        lastName: p.lastName,
        passport: p.passport ?? null,
        phone: p.phone,
      });
    });

    onNext();
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
                    onClick={() => remove(index)}
                    className="flex gap-4 text-white bg-red-500 px-5 py-3 rounded-3xl"
                  >
                    <TrashIcon />
                    <p>{t('Удалить')}</p>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start max-lg:gap-4">
                <h1 className="font-bold text-xl">
                  {t('Участник')} {index + 1}
                </h1>
                <Select
                  onValueChange={(val) => {
                    const p = participantsDate.find(
                      (p) => `${p.firstName}-${p.lastName}` === val,
                    );
                    if (!p) return;
                    const parsedDate = parse(
                      p.birthDate,
                      'dd.MM.yyyy',
                      new Date(),
                    );
                    form.setValue(
                      `participants.${index}.firstName`,
                      p.firstName,
                    );
                    form.setValue(`participants.${index}.lastName`, p.lastName);
                    form.setValue(`participants.${index}.phone`, p.phone);
                    form.setValue(
                      `participants.${index}.gender`,
                      p.gender as 'male' | 'female',
                    );
                    form.setValue(`participants.${index}.date`, parsedDate);
                    form.setValue(`participants.${index}.passport`, null);
                  }}
                >
                  <SelectTrigger className="w-60 max-lg:w-full">
                    <SelectValue placeholder={t('Сохранённые попутчики')} />
                    <KeyboardArrowDownIcon />
                  </SelectTrigger>
                  <SelectContent>
                    {participantsDate.map((p, idx) => (
                      <SelectItem
                        key={idx}
                        value={`${p.firstName}-${p.lastName}`}
                      >
                        {p.firstName} {p.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormField
                control={form.control}
                name={`participants.${index}.gender`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Пол')}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-8 mt-2 max-sm:flex-col max-sm:items-start">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Input
                            type="radio"
                            value="male"
                            checked={field.value === 'male'}
                            onChange={field.onChange}
                            className="w-6 h-6 accent-[#084FE3]"
                          />
                          {t('Мужчина')}
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
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
                      <Label className="text-lg font-semibold">
                        {t('Имя')}
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t('Введите имя')}
                          className="px-5 h-14 rounded-lg"
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
                      <Label className="text-lg font-semibold">
                        {t('Фамилия')}
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t('Введите фамилию')}
                          className="p-5 rounded-lg h-14"
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
                      <Label className="text-lg">
                        {t('Время возвращения')}
                      </Label>
                      <FormControl>
                        <div>
                          <div className="max-lg:hidden">
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <button
                                  className={cn(
                                    'w-full justify-start text-left cursor-pointer relative font-normal border-2 h-full border-[#EDEEF1] rounded-md p-[12px]',
                                    !field.value && 'text-muted-foreground',
                                  )}
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
                                    setOpen(false);
                                  }}
                                  captionLayout="dropdown"
                                  disabled={{ before: new Date() }}
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
                      <Label className="text-lg font-semibold">
                        {t('Телефон номер')}
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t('Введите номер')}
                          className="p-5 rounded-lg h-14"
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
                          field.onChange(file);
                        }}
                        type="file"
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
              {passportValue && (
                <div className="w-full flex items-center max-lg:flex-col max-lg:gap-4 max-lg:items-start justify-between p-3 border-2 border-[#EDEEF1] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="relative w-[50px] h-[50px] cursor-pointer">
                      <Image
                        src={
                          typeof passportValue === 'string'
                            ? passportValue // agar string URL bo‘lsa
                            : URL.createObjectURL(passportValue as File) // agar File bo‘lsa
                        }
                        alt="passport"
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>
                    <div>
                      <div className="max-w-[100px] sm:max-w-[80%] truncate">
                        <h1 className="font-bold text-sm truncate">
                          {typeof passportValue === 'string'
                            ? passportValue
                            : (passportValue as File)?.name}
                        </h1>
                      </div>
                      {typeof passportValue !== 'string' && (
                        <p className="text-xs text-[#718096]">
                          {((passportValue?.size || 0) / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:w-full">
                    <button
                      type="button"
                      onClick={() =>
                        form.setValue(`participants.${index}.passport`, null)
                      }
                      className="p-2 flex gap-4 rounded-full bg-red-500 text-white max-sm:w-full max-sm:justify-center"
                    >
                      <TrashIcon />
                      <p className="sm:hidden">{t('Удалить')}</p>
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 bg-[#084FE3] text-white px-3 py-2 rounded-full max-sm:w-full max-sm:justify-center"
                      onClick={() => {
                        setPreviewFile(passportValue as File);
                        setPreviewOpen(true);
                      }}
                    >
                      <UserIcon />
                      {t('Посмотреть')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div className="flex gap-4 justify-between max-lg:flex-col-reverse">
          <button
            onClick={onPrev}
            className="bg-gray-200 border shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 px-10 py-4 rounded-full cursor-pointer"
          >
            {t('Назад')}
          </button>
          <div className="flex gap-4 max-lg:flex-col">
            <button
              type="button"
              onClick={() =>
                append({
                  gender: 'male',
                  firstName: '',
                  lastName: '',
                  phone: '',
                  date: null,
                  passport: null,
                })
              }
              className="flex items-center gap-2 bg-white border px-6 py-3 rounded-full cursor-pointer"
            >
              <Plus /> {t('Новый участник')}
            </button>
            <button
              type="submit"
              className="bg-[#084FE3] text-white px-10 py-4 rounded-full cursor-pointer"
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
                typeof previewFile === 'string'
                  ? previewFile
                  : URL.createObjectURL(previewFile)
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
